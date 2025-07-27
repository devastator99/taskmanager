# Create your views here.
from rest_framework import viewsets
from rest_framework import filters as drf_filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Task
from .serializers import TaskSerializer
from .permissions import IsAdminOrOwner

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAdminOrOwner]
    filter_backends   = [DjangoFilterBackend, drf_filters.OrderingFilter]
    filterset_fields  = ['due_date', 'priority', 'assigned_to', 'completed']
    ordering_fields   = ['due_date', 'priority', 'created_at']
