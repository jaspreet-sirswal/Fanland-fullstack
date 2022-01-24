from rest_framework import serializers
from .models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class UserSearch(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'user_name')

class FanclubSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fanclub
        fields = '__all__'


class BasicFanclubSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fanclub
        fields = ('id', 'name', 'des', 'image', 'creator')


class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User_detail
        fields = '__all__'


class ModifyUserDetails(serializers.ModelSerializer):
    class Meta:
        model = User_detail
        fields = ('user_status', 'user_profile_image')


class BasicUserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User_detail
        fields = ('user_id', 'user_name', 'user_profile_image', 'user_status')


class ChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chat
        fields = '__all__'


class FanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fan
        fields = ('last_active_date','last_active_time')


class GetFanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fan
        fields = ('fan_id',)
