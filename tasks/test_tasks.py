from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from users.models import User
from tasks.models import Task

class TaskAPITest(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.admin = User.objects.create_user(
            username='admin',
            email='admin@x.com',
            password='pass',
            role='admin'
        )
        cls.alice = User.objects.create_user(
            username='alice',
            email='alice@x.com',
            password='pass',
            role='user'
        )
        cls.bob = User.objects.create_user(
            username='bob',
            email='bob@x.com',
            password='pass',
            role='user'
        )

        # Create tasks with varying attributes
        Task.objects.create(
            title='T1', due_date='2025-08-01T00:00:00Z',
            priority=1, assigned_to=cls.alice
        )
        Task.objects.create(
            title='T2', due_date='2025-09-01T00:00:00Z',
            priority=3, assigned_to=cls.bob
        )

    def auth(self, user):
        self.client.force_authenticate(user=user)

    def test_list_and_filter(self):
        self.auth(self.admin)
        url = reverse('task-list')
        # No filter: both tasks
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(len(resp.data), 2)

        # Filter by priority=1
        resp2 = self.client.get(url, {'priority': 1})
        self.assertEqual(len(resp2.data), 1)
        self.assertEqual(resp2.data[0]['title'], 'T1')

    def test_create_and_retrieve(self):
        self.auth(self.alice)
        url = reverse('task-list')
        data = {
            'title': 'NewTask',
            'due_date': '2025-10-10T12:00:00Z',
            'priority': 2,
            'assigned_to': self.alice.id
        }
        create = self.client.post(url, data, format='json')
        self.assertEqual(create.status_code, status.HTTP_201_CREATED)
        new_id = create.data['id']

        # Retrieve it
        ret = self.client.get(reverse('task-detail', args=[new_id]))
        self.assertEqual(ret.data['title'], 'NewTask')

    def test_update_and_delete(self):
        t2 = Task.objects.get(title='T2')
        self.auth(self.bob)

        # Update own task
        upd = self.client.patch(
            reverse('task-detail', args=[t2.id]),
            {'completed': True}, format='json'
        )
        self.assertEqual(upd.status_code, status.HTTP_200_OK)
        t2.refresh_from_db()
        self.assertTrue(t2.completed)

        # Delete own task
        del_res = self.client.delete(reverse('task-detail', args=[t2.id]))
        self.assertEqual(del_res.status_code, status.HTTP_204_NO_CONTENT)

    def test_permission_enforced(self):
        t1 = Task.objects.get(title='T1')
        self.auth(self.bob)

        # Bob cannot delete Alice’s task
        resp = self.client.delete(reverse('task-detail', args=[t1.id]))
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)
