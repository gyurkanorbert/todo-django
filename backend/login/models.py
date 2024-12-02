from django.db import models


# class User(models.Model):
#     id = models.AutoField(primary_key=True)
#     uuid = models.UUIDField(default=uuid.uuid4(), editable=False, unique=True)
#     name = models.CharField(max_length=100)
#     email = models.EmailField(unique=True)
#     group = models.CharField(max_length=100, null=True, blank=True)
#     password = models.CharField(max_length=100)
#     created_at = models.DateTimeField(auto_now_add=True)
#
#     def __str__(self):
#         return self.name
#
# # Create your models here.
