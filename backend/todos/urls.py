from django.urls import path, re_path
from rest_framework.routers import DefaultRouter

from . import views
from .views import TodoViewSet

router = DefaultRouter()
router.register(r'todos', TodoViewSet)

urlpatterns = router.urls
urlpatterns += [
    re_path('users', views.users),
    path('groups', views.groups),
    re_path('groups/create', views.create_group),
    re_path('join', views.join),
    re_path('collabs', views.joined_groups),
    path('group/<str:id>', views.group_by_id),
    path('tdo', views.todo)
]
