from django.urls import path
from .views import *

urlpatterns = [
    path('mybookings/', BookingView.as_view()),
    path('mybookings/<int:pk>/', BookingView.as_view()),
    
    path('admin/bookings/', AdminBookingView.as_view()),
    path('admin/bookings/<int:pk>/', AdminBookingView.as_view()),
]