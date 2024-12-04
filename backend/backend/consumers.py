import json

from channels.generic.websocket import AsyncWebsocketConsumer, WebsocketConsumer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

# from backend.todos.models import Todo
# from backend.todos.serializers import TodoCreateDTO


class UserConsumer(WebsocketConsumer):
    connected_users = 0
    def connect(self):
        print('connecting')
        UserConsumer.connected_users += 1
        self.accept()
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_add)("users", self.channel_name)
        async_to_sync(channel_layer.group_send)("users", {
            "type": "user_count",
            "count": UserConsumer.connected_users
        })
        print(f"Connected! Currently online: {UserConsumer.connected_users}" )
        self.send(text_data=json.dumps({
            "type": "user_count",
            "count": UserConsumer.connected_users
        }))
    def disconnect(self, code):
        UserConsumer.connected_users -= 1
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)("users", {
            "type": "user_count",
            "count": UserConsumer.connected_users
        })
        async_to_sync(channel_layer.group_discard)("users", self.channel_name)
        print(f"Disconnected: {UserConsumer.connected_users}")
    def user_count(self, event):
        self.send(text_data=json.dumps({
            "type": "user_count",
            "count": UserConsumer.connected_users
        }))


class GroupConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        channel_layer = get_channel_layer()
        user = self.scope['user']
        async_to_sync(self.channel_layer.group_add)("group_updates", self.channel_name)
    def group_update(self, event):
        self.send(text_data=json.dumps({
            "type": "group_update",
            "group": event["group"]
        }))

class TodoGroupConsumer(WebsocketConsumer):

    def connect(self):
        channel_layer = get_channel_layer()
        group_id = self.scope['url_route']['kwargs']['group_id']  # lekeri a matchelo url routebol a csoportid-t
        async_to_sync(channel_layer.group_add)(f"group_{group_id}", self.channel_name) #hozzaadja a usereket, a csoportnak megfelelo

        self.accept()
    def receive(self, text_data=None, bytes_data=None):
         channel_layer = get_channel_layer()
         # data = json.loads(text_data)

         # if data['type'] == 'todo_update':
         #     todo_id = data['todo_id']
         #     try:
         #            todo = Todo.object.get(uuid=todo_id)
         #            todo.completed = not todo.completed
         #            todo.save()
         #            serializer = TodoCreateDTO(todo)
         #            (async_to_sync(channel_layer.group_send)
         #             (f"group_{group}", {
         #
         #            }))
         #    except Todo.DoesNotExist:


         text_data_json = json.loads(text_data)
         group_id = self.scope['url_route']['kwargs']['group_id']  # lekeri a matchelo url routebol a csoportid-t
         async_to_sync(self.channel_layer.group_send)(
             f"group_{group_id}", {
             'type': 'todo_event',
             'todo': text_data_json['todo']
         })




    def todo_event(self, event):
        self.send(text_data=json.dumps(event))
