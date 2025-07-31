from rest_framework import serializers
from .models import Task
from projects.models import Project

class ProjectNameField(serializers.ReadOnlyField):
    def get_attribute(self, instance):
        return instance.project.name if instance.project else None


class TaskSerializer(serializers.ModelSerializer):
    assigned_to_username = serializers.CharField(
        source='assigned_to.username', read_only=True
    )
    project_name = ProjectNameField(source='project', read_only=True)

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description',
            'due_date', 'priority',
            'assigned_to', 'assigned_to_username',
            'project', 'project_name',
            'completed', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
