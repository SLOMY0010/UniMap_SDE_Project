# class_schedule/serializers.py
from rest_framework import serializers
from .models import UserCalendar, CalendarEvent
from .utils import sync_user_calendar_now
from django.utils import timezone
from rest_framework.response import Response


class UserCalendarSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCalendar
        fields = ("source_link", "token", "last_synced", "enabled")
        read_only_fields = ("token", "last_synced")

        def update(self, request, *args, **kwargs):
            partial = kwargs.pop('partial', False)
            instance = self.get_object()
            old_link = instance.source_link

            serializer = self.get_serializer(instance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
            calendar = serializer.save()

            # If new link provided, sync now
            if calendar.source_link and calendar.source_link != old_link:
                result = sync_user_calendar_now(calendar)
                calendar.last_synced = timezone.now()
                calendar.save(update_fields=["last_synced"])
            else:
                result = None

            return Response({
                "calendar": UserCalendarSerializer(calendar).data,
                "sync_result": result,
            })

class CalendarEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalendarEvent
        fields = ("id", "source_uid", "title", "description", "location", "start", "end")
