from django.urls import path
from .views import *

urlpatterns = [
    path('users/', UserView.as_view()),
    path('users/<int:pk>/', UserView.as_view()),

    # For Authentication
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    path('logout/', LogoutView.as_view()),
    path('chk-tkn/', TokenRemainingTimeView.as_view()),

    
]