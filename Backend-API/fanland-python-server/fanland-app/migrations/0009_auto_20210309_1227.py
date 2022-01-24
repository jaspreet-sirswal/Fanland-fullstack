# Generated by Django 3.1.7 on 2021-03-09 06:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('todo', '0008_remove_fanclub_club_id'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Todo',
        ),
        migrations.AddField(
            model_name='user',
            name='admin_clubs',
            field=models.ManyToManyField(related_name='admin_clubs', to='todo.Fanclub'),
        ),
        migrations.AddField(
            model_name='user',
            name='liked_clubs',
            field=models.ManyToManyField(related_name='liked_clubs', to='todo.Fanclub'),
        ),
        migrations.AlterField(
            model_name='user',
            name='following_clubs',
            field=models.ManyToManyField(related_name='following_clubs', to='todo.Fanclub'),
        ),
    ]