from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Todo, Group, UserGroup
from .models import User

class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = ['id', 'uuid','user', 'title', 'completed', 'created_at']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'uuid', 'name', 'email', 'user_groups']

class GroupUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserGroup
        fields = ['user', 'group', 'created_at']

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name', 'created_at']