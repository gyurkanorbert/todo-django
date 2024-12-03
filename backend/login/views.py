from django.shortcuts import render, get_object_or_404
# from lxml.html.diff import token
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import UserSerializer, UserDTO
from rest_framework import status
from rest_framework.authtoken.models import Token  #fetch and create tokens from the database
from todos.models import User


#for checking tokens
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated


@api_view(['POST'])
def login(request):

        user = get_object_or_404(User, email=request.data['email'])

        if not user.check_password(request.data['password']):
            return Response({
                "detail": "Incorrect email or password",
            }, status=status.HTTP_404_NOT_FOUND)


        serializer = UserSerializer(user)
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            "message" : "Login successful",
            "token" : token.key,
            "user": serializer.data,
        })




@api_view(['POST'])
def signup(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        user = User.objects.get(email=request.data['email'])
        user.set_password(request.data['password'])
        user.save()
        token = Token.objects.create(user=user)

        return Response({'token': token.key,
                         'user': {
                             "id": user.id,
                             "email": user.email,
                             "name": user.name,
                         }

                         })
    return Response(
        serializer.errors,
        status = status.HTTP_400_BAD_REQUEST
    )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def test_token(request):
    return Response("passed for {}".format(request.user.email) )



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    user_serializer = UserDTO(request.user)
    return Response({
        "user": user_serializer.data,
    })

