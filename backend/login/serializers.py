from rest_framework import serializers
from todos.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = User
        fields = ['uuid', 'name']