from django.urls import path
from .views import *

urlpatterns = [
    path('users/', UserView.as_view()),
    path('users/<int:pk>/', UserView.as_view()),

    # For Authentication
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('chk-tkn/', TokenRemainingTimeView.as_view()),

    path('user-stat/', UserStatView.as_view()),

    
]