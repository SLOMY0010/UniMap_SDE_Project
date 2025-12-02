# class_schedule/urls.py
from django.urls import path
from .views import UserCalendarView, ListEventsView, UploadICSView

urlpatterns = [
    path("my_calendar/", UserCalendarView.as_view(), name="user-calendar"),
    path("my_events/", ListEventsView.as_view(), name="list-events"),
    path("upload/", UploadICSView.as_view(), name="upload-ics"),
]
