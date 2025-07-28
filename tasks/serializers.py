from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    assigned_to_username = serializers.CharField(
        source='assigned_to.username', read_only=True
    )

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description',
            'due_date', 'priority',
            'assigned_to', 'assigned_to_username',
            'completed', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
