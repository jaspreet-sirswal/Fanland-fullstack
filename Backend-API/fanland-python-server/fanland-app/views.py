from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from .models import *
from .serializers import *


@api_view(['GET', 'PUT', 'DELETE'])
def user(request, username, userpassword):
    if request.method == 'GET':
        try:
            user = User.objects.get(
                user_name=username, user_password=userpassword)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializisedData = UserSerializer(user, context={'request': request})
        return Response(serializisedData.data)


@api_view(['POST'])
def post_user(request):
    if request.method == 'POST':
        serializised_user = UserSerializer(data=request.data)
        if serializised_user.is_valid():
            serializised_user.save()
            return Response(serializised_user.data['id'])
        return Response(serializised_user.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_user_detail_basic(request, userid):
    try:
        user_detail_data = User_detail.objects.get(user_id=userid)
    except User_detail.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializisedData = BasicUserDetailSerializer(
            user_detail_data, context={'request': request})
        return Response(serializisedData.data)


@api_view(['GET'])
def get_user_detail_datatype(request, userid, datatype):
    try:
        user_detail_data = User_detail.objects.get(
            user_id=userid)
    except User_detail.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializisedData = UserDetailSerializer(
            user_detail_data, context={'request': request})
        return Response(serializisedData.data[datatype])


@api_view(['GET', 'PUT'])
def put_user_detail(request, userid):
    try:
        user_detail_data = User_detail.objects.get(user_id=userid)
    except User_detail.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializedData = UserDetailSerializer(user_detail_data)
        return Response(serializedData.data)

    elif request.method == 'PUT':
        serializer = UserDetailSerializer(
            user_detail_data, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
def modify_user_detail(request, userid):
    try:
        user_detail_data = User_detail.objects.get(user_id=userid)
    except User_detail.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = ModifyUserDetails(
            user_detail_data, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def post_user_detail(request):
    if request.method == 'POST':
        serialised_user_detail = UserDetailSerializer(data=request.data)
        if serialised_user_detail.is_valid():
            serialised_user_detail.save()
            return Response(status=status.HTTP_201_CREATED)


@api_view(['GET', 'POST'])
def fanclub_list(request):
    if request.method == 'GET':
        data = Fanclub.objects.all()
        serializisedData = BasicFanclubSerializer(
            data, many=True)
        return Response(serializisedData.data)

    elif request.method == 'POST':
        serializisedData = FanclubSerializer(data=request.data)
        if serializisedData.is_valid():
            serializisedData.save()
            return Response(serializisedData.data['id'])
        return Response(serializisedData.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def search_user(request, username):
    if request.method == 'GET':
        data = User.objects.get(user_name=username)
        serializisedData = UserSearch(
            data)
        return Response(serializisedData.data)


@api_view(['GET'])
def search_fanclub(request, clubname):
    if request.method == 'GET':
        data = Fanclub.objects.get(name=clubname)
        serializisedData = BasicFanclubSerializer(
            data)
        return Response(serializisedData.data)


@api_view(['GET', 'PUT', 'DELETE'])
def fanclub(request, clubid):
    parser_classes = (MultiPartParser, FormParser)
    try:
        fanclub = Fanclub.objects.get(id=clubid)
    except Fanclub.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializisedData = FanclubSerializer(fanclub)
        return Response(serializisedData.data)

    elif request.method == 'PUT':
        serializer = FanclubSerializer(
            fanclub, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        fanclub.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['PUT'])
def modify_fanclub(request, clubid):
    try:
        fanclub = Fanclub.objects.get(id=clubid)
    except Fanclub.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = BasicFanclubSerializer(
            fanclub, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def fanclub_basic_creator(request, creator):
    if request.method == 'GET':
        fanclub = Fanclub.objects.filter(creator=creator)
        serializisedData = BasicFanclubSerializer(fanclub, many=True)
        return Response(serializisedData.data)


@api_view(['GET'])
def fanclub_basic(request, clubid):
    try:
        fanclub = Fanclub.objects.get(id=clubid)
    except Fanclub.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializisedData = BasicFanclubSerializer(fanclub)
        return Response(serializisedData.data)


@api_view(['GET', 'POST'])
def fanclub_chat_list(request, chatroomid):
    parser_classes = (MultiPartParser, FormParser)
    if request.method == 'GET':
        data = Chat.objects.filter(chatroom_id=chatroomid).order_by('id')
        serializisedData = ChatSerializer(
            data, many=True)
        return Response(serializisedData.data)

    elif request.method == 'POST':
        fanid = request.data['author_id']
        fanclubid = request.data['chatroom_id']
        try:
            fan = Fan.objects.get(fan_id=fanid, fanclub_id=fanclubid)
            fan.activity_count += 1
            fan.save()
        except:
            user = User.objects.get(id=fanid)
            fanclub = Fanclub.objects.get(id=fanclubid)
            fan = Fan(fan_id=user, fanclub_id=fanclub)
            fan.save()

        serializisedData = ChatSerializer(data=request.data)
        if serializisedData.is_valid():
            serializisedData.save()

            return Response(serializisedData.data)
        return Response(serializisedData.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'DELETE'])
def chat_details(request, chatid):
    try:
        chat = Chat.objects.get(id=chatid)
    except Chat.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method == 'DELETE':
        chat.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
def get_fan(request, fanclubid):
    if request.method == 'GET':
        data = Fan.objects.filter(fanclub_id=fanclubid)[:5]
        serializisedData = GetFanSerializer(
            data, many=True)
        return Response(serializisedData.data)


@api_view(['GET', 'PUT'])
def get_fan_last_active(request, fanid, fanclubid):
    try:
        fan = Fan.objects.get(fan_id=fanid, fanclub_id=fanclubid)
    except:
        try:
            user = User.objects.get(id=fanid)
            fanclub = Fanclub.objects.get(id=fanclubid)
            fan = Fan(fan_id=user, fanclub_id=fanclub)
            fan.save()
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        serializisedData = FanSerializer(fan)
        return Response(serializisedData.data)

    if request.method == 'PUT':
        try:
            fan.last_active_date = timezone.localdate()
            fan.last_active_time = timezone.localtime()
            fan.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Fan.DoesNotExist:
            print("Something went wrong.")
            return Response(status=status.HTTP_400_BAD_REQUEST)
