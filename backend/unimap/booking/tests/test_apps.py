from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from datetime import date, time
from booking.models import Booking
from uni.models import Room
from users.models import User

class BookingViewTests(APITestCase):
    
    def setUp(self):
        self.room = Room.objects.create(name="Test Room")

        self.register_url = reverse('register')
        self.login_url = reverse('login')
        self.booking_url = reverse('booking-list')   # adjust if your endpoint differs
        
        self.user_data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "pass1234"
        }

    def authenticate(self):
        # Register
        self.client.post(self.register_url, self.user_data)

        # Login
        login_response = self.client.post(self.login_url, {
            "email": self.user_data["email"],
            "password": self.user_data["password"]
        })

        token = login_response.data["jwt"]

        # Set JWT in header
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    def test_create_booking_success(self):
        self.authenticate()

        payload = {
            "room": self.room.id,
            "date": "2025-01-01",
            "start_time": "10:00",
            "end_time": "11:00",
            "purpose": "Study"
        }

        response = self.client.post(self.booking_url, payload)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Booking.objects.count(), 1)

    def test_conflict_booking_same_room(self):
        self.authenticate()

        # Create a booking
        Booking.objects.create(
            room=self.room,
            user=User.objects.get(email="test@example.com"),
            date=date(2025,1,1),
            start_time=time(10,0),
            end_time=time(11,0),
            status="approved"
        )

        # Now attempt conflicting booking
        payload = {
            "room": self.room.id,
            "date": "2025-01-01",
            "start_time": "10:30",
            "end_time": "11:30",
            "purpose": "Meeting"
        }

        response = self.client.post(self.booking_url, payload)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Room already booked", str(response.data))
