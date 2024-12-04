from django.urls import re_path, path
from . import consumers

websocket_urlpatterns = [
    re_path(r"ws/counter/$", consumers.UserConsumer.as_asgi()),
    re_path(r"ws/group_actions/$", consumers.GroupConsumer.as_asgi()),
    path('ws/groups/<str:group_id>/', consumers.TodoGroupConsumer.as_asgi()),

]