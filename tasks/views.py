from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from rest_framework.permissions import IsAuthenticated
from .models import Task
from .serializers import TaskSerializer
from .permissions import IsAdminOrOwner

class TaskViewSet(viewsets.ModelViewSet):
    """
    list, create, retrieve, update, partial_update, destroy
    """
    queryset = Task.objects.select_related('assigned_to').all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated, IsAdminOrOwner]

    filter_backends = [
        DjangoFilterBackend,
        filters.OrderingFilter,
        filters.SearchFilter,
    ]

    # Filterable fields
    filterset_fields = {
        'due_date': ['exact', 'lt', 'gt'],
        'priority': ['exact'],
        'assigned_to__username': ['exact', 'icontains'],
        'completed': ['exact'],
    }

    # Allow clients to order by these fields
    ordering_fields = ['due_date', 'priority', 'created_at', 'updated_at']

    # Full‑text search on these fields
    search_fields = ['title', 'description']
