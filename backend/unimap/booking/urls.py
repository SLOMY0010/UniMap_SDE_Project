from django.urls import path
from .views import *

urlpatterns = [
    path('mybookings/', BookingView.as_view(), name='booking-list'),
    path('mybookings/<int:pk>/', BookingView.as_view(), name='booking-detail'),
    
    path('admin/bookings/', AdminBookingView.as_view(), name='admin-booking-list'),
    path('admin/bookings/<int:pk>/', AdminBookingView.as_view(), name='admin-booking-detail'),
]