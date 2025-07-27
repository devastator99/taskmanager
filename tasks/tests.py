# tasks/tests.py

import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from tasks.models import Task

User = get_user_model()

@pytest.fixture(autouse=True)
def enable_db_access_for_all_tests(db):
    """
    Give all tests access to the database.
    """
    pass

class AuthTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user(
            username='regular',
            email='regular@example.com',
            password='pass123',
            role='user'
        )

    def test_obtain_token(self):
        url = reverse('token_obtain_pair')
        resp = self.client.post(url,
                                {'username': 'regular', 'password': 'pass123'},
                                format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn('access', resp.data)
        self.assertIn('refresh', resp.data)

    def test_refresh_token(self):
        # First get a refresh token
        obtain_url = reverse('token_obtain_pair')
        r1 = self.client.post(obtain_url,
                              {'username': 'regular', 'password': 'pass123'},
                              format='json')
        refresh = r1.data['refresh']

        refresh_url = reverse('token_refresh')
        r2 = self.client.post(refresh_url,
                              {'refresh': refresh},
                              format='json')
        self.assertEqual(r2.status_code, status.HTTP_200_OK)
        self.assertIn('access', r2.data)


class TaskPermissionsTest(APITestCase):
    def setUp(self):
        # Create users
        self.admin = User.objects.create_user(
            username='admin',
            email='admin@example.com',
            password='pass123',
            role='admin'
        )
        self.user1 = User.objects.create_user(
            username='alice',
            email='alice@example.com',
            password='pass123',
            role='user'
        )
        self.user2 = User.objects.create_user(
            username='bob',
            email='bob@example.com',
            password='pass123',
            role='user'
        )

        # Create tasks
        self.task1 = Task.objects.create(
            title='Alice’s Task',
            due_date='2025-08-01T10:00:00Z',
            priority=1,
            assigned_to=self.user1
        )
        self.task2 = Task.objects.create(
            title='Bob’s Task',
            due_date='2025-08-02T11:00:00Z',
            priority=2,
            assigned_to=self.user2
        )

    def authenticate(self, user):
        self.client.force_authenticate(user=user)

    def test_admin_can_delete_any_task(self):
        self.authenticate(self.admin)
        url = reverse('task-detail', args=[self.task2.id])
        resp = self.client.delete(url)
        self.assertEqual(resp.status_code, status.HTTP_204_NO_CONTENT)

    def test_regular_user_can_delete_own_task(self):
        self.authenticate(self.user1)
        url = reverse('task-detail', args=[self.task1.id])
        resp = self.client.delete(url)
        self.assertEqual(resp.status_code, status.HTTP_204_NO_CONTENT)

    def test_regular_user_cannot_delete_others_task(self):
        self.authenticate(self.user1)
        url = reverse('task-detail', args=[self.task2.id])
        resp = self.client.delete(url)
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

    def test_regular_user_can_update_own_task(self):
        self.authenticate(self.user2)
        url = reverse('task-detail', args=[self.task2.id])
        resp = self.client.patch(url,
                                 {'completed': True},
                                 format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.task2.refresh_from_db()
        self.assertTrue(self.task2.completed)

    def test_regular_user_cannot_update_others_task(self):
        self.authenticate(self.user2)
        url = reverse('task-detail', args=[self.task1.id])
        resp = self.client.patch(url,
                                 {'completed': True},
                                 format='json')
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

    def test_any_authenticated_user_can_list_tasks(self):
        # Listing isn’t object‐restricted, only actions are
        self.authenticate(self.user1)
        url = reverse('task-list')
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        # Should see both tasks (permission is at object level)
        self.assertEqual(len(resp.data), 2)

    def test_task_str_representation(self):
        self.assertEqual(str(self.task1), "Alice’s Task (Low)")
        self.assertEqual(str(self.task2), "Bob’s Task (Medium)")
