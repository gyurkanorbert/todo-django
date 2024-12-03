from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings
import uuid

from django.utils.crypto import get_random_string


# class User(AbstractUser):
#     id = models.AutoField(primary_key=True)
#     uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
#     name = models.CharField(max_length=100)
#     email = models.EmailField(unique=True),
#     username = models.CharField(max_length=100, unique=True)
#     user_groups = models.ManyToManyField('Group', through='UserGroup')
#     created_at = models.DateTimeField(auto_now_add=True)
#
#     def __str__(self):
#         return self.name

class User(AbstractUser):
    id = models.AutoField(primary_key=True)
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    name = models.CharField(max_length=100)
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True)
    user_groups = models.ManyToManyField('Group', through='UserGroup')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Todo(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=100)
    uuid = models.UUIDField(default=uuid.uuid4,editable=False, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    belongs_group = models.ForeignKey('Group', on_delete=models.CASCADE)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self): #what to print when we want to print it out
        return self.title



def get_group_id():
    return get_random_string(6)

class Group(models.Model):
    id = models.CharField(
        max_length=6,
        primary_key=True,
        default=get_group_id,
        editable=False
    )
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self): return self.name

class UserGroup(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'group')



