from django.contrib import admin
from .models import Todo, User, Group, UserGroup

admin.site.register(Todo)
admin.site.register(User)
admin.site.register(Group)
admin.site.register(UserGroup)

# Register your models here.
