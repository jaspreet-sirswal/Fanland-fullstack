# Generated by Django 3.1.7 on 2021-03-10 07:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('todo', '0028_auto_20210310_0307'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user_detail',
            name='user_profile_image',
            field=models.ImageField(blank=True, default='users_media/red_profile_pic.png', upload_to='users_media'),
        ),
    ]
