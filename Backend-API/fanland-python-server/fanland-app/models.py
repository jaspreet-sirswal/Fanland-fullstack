from django.db import models
from django.contrib.postgres.fields import ArrayField
from datetime import datetime
from django.utils import timezone


class User(models.Model):
    user_name = models.CharField(max_length=30, unique=True)
    user_password = models.CharField(max_length=30)
    email = models.EmailField(max_length=50, unique=True)

    class Meta:
        ordering = ['user_name']

    def __str__(self):
        self.user_password
        return self.user_name


class Fanclub(models.Model):
    name = models.CharField(max_length=30, blank=True)
    des = models.TextField(blank=True)
    image = models.ImageField(
        upload_to='fanclub_media', default='fanclub_media/Film_Review_Dark_Knight_Rises-085d2-4549.jpg', blank=True)
    creator = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='creator', blank=True)
    # top_fans = models.ManyToManyField(
    #     User, blank=True, related_name='top_fans')
    members = models.ManyToManyField(
        User, blank=True, related_name='members')
    admin_members = models.ManyToManyField(
        User,  blank=True, related_name='admin_members')
    banned_users = models.ManyToManyField(
        User, blank=True,  related_name='banned_user')

    def __str__(self):
        return self.name


class Chat(models.Model):
    chatroom_id = models.ForeignKey(
        Fanclub, on_delete=models.CASCADE, blank=True)
    author_image = models.CharField(max_length=1000, blank=True)
    author_name = models.CharField(max_length=30, blank=True)
    author_id = models.ForeignKey(User, on_delete=models.CASCADE)
    is_image_message = models.BooleanField(default=False, blank=True)
    message = models.TextField(blank=True)
    media = models.ImageField(upload_to='chats_media', blank=True)
    date = models.DateField(auto_now_add=True, blank=True)
    time = models.TimeField(auto_now_add=True, blank=True)

    class Meta:
        ordering = ['chatroom_id']

    def __str__(self):
        return self.author_name


class User_detail(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, blank=True)
    user_name = models.CharField(max_length=30, blank=True)
    user_profile_image = models.ImageField(
        upload_to='users_media', default='users_media/red_profile_pic.png', blank=True)
    user_status = models.CharField(
        max_length=100, default='A big love with movies', blank=True)
    following_clubs = models.ManyToManyField(
        Fanclub, blank=True, related_name='following_clubs')
    admin_clubs = models.ManyToManyField(
        Fanclub, blank=True, related_name='admin_clubs')
    liked_clubs = models.ManyToManyField(
        Fanclub, blank=True, related_name='liked_clubs')
    recent_clubs = models.ManyToManyField(
        Fanclub, blank=True, related_name='recent_clubs')


class Fan(models.Model):
    fan_id = models.ForeignKey(User, on_delete=models.CASCADE, blank=True)
    fanclub_id = models.ForeignKey(
        Fanclub, on_delete=models.CASCADE, blank=True)
    activity_count = models.IntegerField(default=0, blank=True)
    last_active_date = models.DateField(default=timezone.now, blank=True)
    last_active_time = models.TimeField(default=timezone.now, blank=True)

    class Meta:
        ordering = ['-activity_count']
