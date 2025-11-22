from django.urls import path
from .views import *

urlpatterns = [
    path('campuses/', CampusView.as_view()),
    path('campuses/<int:pk>/', CampusView.as_view()),
]