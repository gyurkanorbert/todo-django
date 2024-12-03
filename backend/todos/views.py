import json

from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.http import JsonResponse, HttpResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import viewsets, status
from .models import Todo, User, Group, UserGroup
from .serializers import TodoSerializer, GroupSerializer, GroupUserSerializer
from .serializers import UserSerializer


class TodoViewSet(viewsets.ModelViewSet):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer
    lookup_field = 'uuid'
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)



@api_view(['GET'])
def users(request):
    user_list = User.objects.all()
    serializer = UserSerializer(user_list, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
def groups(request):
    serializer = GroupSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        group = Group.objects.get(id=serializer.data['id'])
        return Response({
            "group": {
                "id": group.id,
                "name": group.name,
                "created_at": group.created_at
            }
        })
    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(['GET'])
def groups(request):

    group_list = Group.objects.all()
    serializer = GroupSerializer(group_list, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
def join(request):
    serializer = GroupUserSerializer(data=request.data)
    if serializer.is_valid():
        ug = serializer.save()
        group = Group.objects.get(id=request.data['group'])
        user = User.objects.get(id=request.data['user'])
        # ug = UserGroup.objects.create(user=user, group=group)
        return Response({
            "message": "Joined group:" + group.id + " successfully",
            # "group": {
            #     "name": ug.name,
            # }
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def joined_groups(request):
    print("Request method:", request.method)
    print("User:", request.user)
    print("Auth:", request.auth)
    group_list = request.user.user_groups.all()
    print("Groups:", group_list)
    serializer = GroupSerializer(group_list, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def group_by_id(request, id):
    try:
        group = Group.objects.get(id=id)
        user = request.user
        if not group.user_set.filter(id=user.id).exists():
            return Response(
                {'error': 'You do not have permission to view this group'},
                status=status.HTTP_403_FORBIDDEN
            )

        todos = Todo.objects.filter(belongs_group=group)
        todo_serializer = TodoSerializer(todos, many=True)

        serializer = GroupSerializer(group)
        return Response({
            "group":serializer.data,
            "todos": todo_serializer.data
        }, status=status.HTTP_200_OK)
    except Group.DoesNotExist:
        return Response({
            "message": "Group not found",

        }, status=status.HTTP_404_NOT_FOUND)