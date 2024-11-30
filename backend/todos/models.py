from django.db import models
import uuid

class Todo(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=100)
    uuid = models.UUIDField(default=uuid.uuid4,editable=False, unique=True)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self): #what to print when we want to print it out
        return self.title