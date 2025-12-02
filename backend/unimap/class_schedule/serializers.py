# class_schedule/serializers.py
from rest_framework import serializers
from .models import UserCalendar, CalendarEvent


class UserCalendarSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCalendar
        fields = ("source_link", "token", "last_synced", "enabled")
        read_only_fields = ("token", "last_synced")


class CalendarEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalendarEvent
        fields = ("id", "source_uid", "title", "description", "location", "start", "end")
