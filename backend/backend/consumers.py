import json

from channels.generic.websocket import AsyncWebsocketConsumer, WebsocketConsumer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


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
        async_to_sync(self.channel_layer.group_add)("group_updates", self.channel_name)
    def group_update(self, event):
        self.send(text_data=json.dumps({
            "type": "group_update",
            "group": event["group"]
        }))