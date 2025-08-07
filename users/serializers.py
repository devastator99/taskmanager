from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    task_count = serializers.SerializerMethodField()
    completed_tasks = serializers.SerializerMethodField()
    pending_tasks = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'password', 'role', 'first_name', 'last_name', 'avatar', 'task_count', 'completed_tasks', 'pending_tasks')
        extra_kwargs = {
            'password': {'write_only': True},
        }
    
    def get_task_count(self, obj):
        if self.context.get('include_stats'):
            return obj.get_task_count()
        return None
    
    def get_completed_tasks(self, obj):
        if self.context.get('include_stats'):
            return obj.assigned_tasks.filter(status='completed').count()
        return None
    
    def get_pending_tasks(self, obj):
        if self.context.get('include_stats'):
            return obj.assigned_tasks.filter(status__in=['todo', 'in_progress']).count()
        return None

    def create(self, validated_data):
        role = validated_data.get('role', 'user')
        avatar = validated_data.get('avatar', '👤')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            role=role,
            avatar=avatar
        )
        if role == 'admin':
            user.is_staff = True
            user.is_superuser = True
            user.save()
        return user
    
    def update(self, instance, validated_data):
        # Remove password from validated_data if present (handled separately)
        validated_data.pop('password', None)
        
        # Update user fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        if username and password:
            user = authenticate(request=self.context.get('request'),
                                username=username, password=password)
            if not user:
                raise serializers.ValidationError('Invalid credentials')
        else:
            raise serializers.ValidationError('Must include "username" and "password".')

        data['user'] = user
        return data
