from django.db import models
from django.conf import settings
from projects.models import Project

class Task(models.Model):
    """A simple task with priority, assignment and completion status."""
    PRIORITY_LOW    = 1
    PRIORITY_MEDIUM = 2
    PRIORITY_HIGH   = 3

    PRIORITY_CHOICES = [
        (PRIORITY_LOW,    'Low'),
        (PRIORITY_MEDIUM, 'Medium'),
        (PRIORITY_HIGH,   'High'),
    ]

    project      = models.ForeignKey(
        Project,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='tasks'
    )
    
    title        = models.CharField(max_length=255)
    description  = models.TextField(blank=True)
    due_date     = models.DateTimeField()
    priority     = models.IntegerField(choices=PRIORITY_CHOICES, default=PRIORITY_MEDIUM)
    assigned_to  = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='tasks'
    )
    completed    = models.BooleanField(default=False)
    created_at   = models.DateTimeField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['due_date']
        indexes = [
            models.Index(fields=['due_date']),
            models.Index(fields=['priority']),
            models.Index(fields=['assigned_to']),
            models.Index(fields=['completed']),
        ]

    def __str__(self):
        return f"{self.title} ({self.get_priority_display()})"
