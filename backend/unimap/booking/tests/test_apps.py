from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from datetime import date, time

from django.contrib.auth import get_user_model
from uni.models import Campus, Building, Room
from booking.models import Booking

User = get_user_model()

class BookingViewTests(APITestCase):
    def setUp(self):
        # Create campus, building, room according to your uni.models
        self.campus = Campus.objects.create(
            name="Main Campus", address="Some Addr", maps_url="http://maps"
        )
        self.building = Building.objects.create(
            name="Main Building", campus=self.campus, address="B Addr", maps_url="http://maps"
        )
        self.room = Room.objects.create(
            name="R101", type="seminar room", building=self.building
        )

        # Register & login user via your auth endpoints (use reverse)
        self.register_url = reverse("register")
        self.login_url = reverse("login")
        self.booking_list_url = reverse("booking-list")   # e.g. path('bookings/', BookingView.as_view(), name='booking-list')

        self.user_data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "pass1234"
        }

        # register
        r = self.client.post(self.register_url, self.user_data, format="json")
        self.assertIn(r.status_code, (status.HTTP_200_OK, status.HTTP_201_CREATED))

        # login to get JWT token
        login_res = self.client.post(self.login_url, {
            "email": self.user_data["email"],
            "password": self.user_data["password"]
        }, format="json")
        assert login_res.status_code == status.HTTP_200_OK, f"Login failed: {login_res.data}"
        token = login_res.data["jwt"]

        # set auth header for subsequent requests
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    def test_create_booking_success(self):
        payload = {
            "room": self.room.id,
            "date": "2025-01-01",
            "start_time": "10:00",
            "end_time": "11:00",
            "purpose": "Study"
        }
        response = self.client.post(self.booking_list_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Booking.objects.count(), 1)
        b = Booking.objects.first()
        self.assertEqual(b.room_id, self.room.id)
        self.assertEqual(b.user.email, self.user_data["email"])

    def test_conflict_booking_same_room(self):
        # create an approved booking by another user
        other = User.objects.create_user(username="other", email="other@example.com", password="pass")
        Booking.objects.create(
            room=self.room,
            user=other,
            date=date(2025,1,1),
            start_time=time(10,0),
            end_time=time(11,0),
            status=Booking.STATUS_APPROVED
        )

        payload = {
            "room": self.room.id,
            "date": "2025-01-01",
            "start_time": "10:30",
            "end_time": "11:30",
            "purpose": "Meeting"
        }

        response = self.client.post(self.booking_list_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Room already booked", str(response.data))

    def test_conflict_booking_same_user(self):
        # create an existing booking for this (logged-in) user that overlaps
        user = User.objects.get(email=self.user_data["email"])
        Booking.objects.create(
            room=self.room,
            user=user,
            date=date(2025,1,1),
            start_time=time(9,0),
            end_time=time(11,0),
            status=Booking.STATUS_PENDING
        )

        payload = {
            "room": self.room.id,
            "date": "2025-01-01",
            "start_time": "10:00",
            "end_time": "12:00",
            "purpose": "Another"
        }

        response = self.client.post(self.booking_list_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("You can't be in two places at once", str(response.data))

    def test_list_only_own_bookings(self):
        other = User.objects.create_user(username="other2", email="other2@example.com", password="pass")
        # booking for other user
        Booking.objects.create(
            room=self.room,
            user=other,
            date=date(2025,1,2),
            start_time=time(9,0),
            end_time=time(10,0)
        )
        # booking for current user
        current_user = User.objects.get(email=self.user_data["email"])
        Booking.objects.create(
            room=self.room,
            user=current_user,
            date=date(2025,1,3),
            start_time=time(11,0),
            end_time=time(12,0)
        )

        res = self.client.get(self.booking_list_url, format="json")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        # ensure returned bookings belong to current user
        for item in res.data:
            self.assertEqual(item["user"], current_user.id)


class AdminBookingViewTests(APITestCase):
    def setUp(self):
        # create campus/building/room as above
        self.campus = Campus.objects.create(name="Main Campus", address="addr", maps_url="http://maps")
        self.building = Building.objects.create(name="B1", campus=self.campus, address="addr", maps_url="http://maps")
        self.room = Room.objects.create(name="R102", type="seminar room", building=self.building)

        # admin user
        self.admin = User.objects.create_superuser(username="admin", email="admin@example.com", password="adminpass")

        # normal user and a booking
        self.user = User.objects.create_user(username="student", email="stu@example.com", password="pass")
        self.booking = Booking.objects.create(
            room=self.room,
            user=self.user,
            date=date(2025,1,5),
            start_time=time(10,0),
            end_time=time(11,0)
        )

        # login admin and set credentials via JWT
        self.register_url = reverse("register")   # not used but left for parity
        self.login_url = reverse("login")
        login_res = self.client.post(self.login_url, {"email":"admin@example.com","password":"adminpass"}, format="json")
        assert login_res.status_code == status.HTTP_200_OK, login_res.data
        token = login_res.data["jwt"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

        self.admin_list_url = reverse("admin-booking-list")
        self.admin_detail_url = lambda pk: reverse("admin-booking-detail", args=[pk])

    def test_admin_approve_booking(self):
        res = self.client.patch(self.admin_detail_url(self.booking.id), {"status": Booking.STATUS_APPROVED}, format="json")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.booking.refresh_from_db()
        self.assertEqual(self.booking.status, Booking.STATUS_APPROVED)

    def test_admin_cannot_cancel_booking(self):
        res = self.client.patch(self.admin_detail_url(self.booking.id), {"status": Booking.STATUS_CANCELLED}, format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("cannot cancel", str(res.data))

    def test_non_admin_cannot_access_admin_endpoints(self):
        # login as normal user
        login_res = self.client.post(self.login_url, {"email":"stu@example.com","password":"pass"}, format="json")
        token = login_res.data["jwt"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

        res = self.client.get(self.admin_list_url, format="json")
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
