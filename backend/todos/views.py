
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import viewsets, status
from .models import Todo, User, Group, UserGroup
from .serializers import TodoSerializer, GroupSerializer, GroupUserSerializer, TodoCreateDTO
from .serializers import UserSerializer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


class TodoViewSet(viewsets.ModelViewSet):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer
    lookup_field = 'uuid'
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def todo(request):

    try:
        group = request.data.get('group_id')
        userID = request.user.id
        # user = User.objects.get(id=userID)
        title = request.data.get('title')


        data = {
            'title': title,
            'belongs_group': group,
            'user': userID,
        }
        todo_serializer = TodoCreateDTO(data=data)
        print(todo_serializer)
        print(userID)
        if todo_serializer.is_valid():
            tdo = todo_serializer.save()
            channel_layer = get_channel_layer()
            response_serializer = TodoSerializer(tdo)
            async_to_sync(channel_layer.group_send)(
                f"group_{group}",
                {
                    "type": "todo_event",
                    "todo": response_serializer.data
                }
            )
            return Response(todo_serializer.data, status=status.HTTP_201_CREATED)
        return Response(todo_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)





@api_view(['GET'])
def users(request):
    user_list = User.objects.all()
    serializer = UserSerializer(user_list, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_group(request):
    serializer = GroupSerializer(data=request.data)
    userID = request.user.id
    if serializer.is_valid():
        serializer.save()


        group = Group.objects.get(id=serializer.data['id'])

        group_user_data = {
            'user': request.user.id,
            'group': group.id,
        }

        group_user_serializer = GroupUserSerializer(data=group_user_data)
        if group_user_serializer.is_valid():
            group_user_serializer.save()

        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"group_updates_{userID}",
            {
                "type": "group_update",
                "group": {
                    "id": group.id,
                    "name": group.name,
                }
            }
        )
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
        # print(f"Channel Layer Groups: {get_channel_layer().groups}")
        ug = serializer.save()

        group = Group.objects.get(id=request.data['group'])
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "group_updates", {
                "type": "group_update",
                "group": {
                    "id": group.id,
                    "name": group.name,
                }
            }
        )
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



