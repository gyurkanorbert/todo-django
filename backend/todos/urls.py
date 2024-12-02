from django.urls import path, re_path
from rest_framework.routers import DefaultRouter

from . import views
from .views import TodoViewSet

router = DefaultRouter()
router.register(r'todos', TodoViewSet)

urlpatterns = router.urls
urlpatterns += [
    re_path('users', views.users),
    re_path('groups', views.groups),
    re_path('join', views.join),
]
