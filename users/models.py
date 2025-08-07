from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('user', 'Regular User'),
    ]
    
    AVATAR_CHOICES = [
        ('👤', 'Default'),
        ('😊', 'Happy'),
        ('🤓', 'Nerd'),
        ('😎', 'Cool'),
        ('🚀', 'Rocket'),
        ('⭐', 'Star'),
        ('🎯', 'Target'),
        ('💼', 'Business'),
        ('🎨', 'Creative'),
        ('🔥', 'Fire'),
    ]
    
    role = models.CharField(
        max_length=10, choices=ROLE_CHOICES, default='user')
    avatar = models.CharField(
        max_length=10, choices=AVATAR_CHOICES, default='👤')

    def is_admin(self):
        return self.role == 'admin'
    
    def get_task_count(self):
        """Get total number of tasks assigned to this user"""
        return self.assigned_tasks.count()


