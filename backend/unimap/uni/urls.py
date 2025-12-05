from django.urls import path
from .views import *

urlpatterns = [
    path('campuses/', CampusView.as_view()),
    path('campuses/<int:pk>/', CampusView.as_view()),
    path('buildings/', BuildingView.as_view()),
    path('buildings/<int:pk>/', BuildingView.as_view()),
    path('rooms/', RoomView.as_view()),
    path('rooms/<int:pk>/', RoomView.as_view()),
    path('floormaps/', FloorMapView.as_view()),
    path('floormaps/<int:pk>/', FloorMapView.as_view()),

    path('search/', UniSearchView.as_view()),
]