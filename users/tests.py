from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import User
from rest_framework_simplejwt.tokens import RefreshToken

class UserProfileAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser', email='test@example.com', password='testpass123', first_name='Test', last_name='User', role='user', avatar='👤'
        )
        self.url = reverse('profile')
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)

    def authenticate(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

    def test_profile_get_unauthenticated(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_profile_get_authenticated(self):
        self.authenticate()
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'testuser')
        self.assertEqual(response.data['email'], 'test@example.com')
        self.assertEqual(response.data['first_name'], 'Test')
        self.assertEqual(response.data['last_name'], 'User')
        self.assertEqual(response.data['role'], 'user')
        self.assertEqual(response.data['avatar'], '👤')

    def test_profile_update_authenticated(self):
        self.authenticate()
        payload = {
            'first_name': 'Updated',
            'last_name': 'Name',
            'avatar': '😊'
        }
        response = self.client.put(self.url, payload)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, 'Updated')
        self.assertEqual(self.user.last_name, 'Name')
        self.assertEqual(self.user.avatar, '😊')

    def test_profile_update_unauthenticated(self):
        payload = {'first_name': 'NoAuth'}
        response = self.client.put(self.url, payload)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
