from django.urls import path
from .views import LoginView, UserRegistrationView, UserProfileView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('signup/', UserRegistrationView.as_view(), name='signup'),
    path('profile/', UserProfileView.as_view(), name='profile'),
]
