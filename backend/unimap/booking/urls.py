from django.urls import path
from .views import *

urlpatterns = [
    path('mybookings/', BookingView.as_view()),
    
    path('admin/bookings/', AdminBookingView.as_view()),
]