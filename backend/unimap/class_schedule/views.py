# class_schedule/views.py
from django.utils import timezone

from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import UserCalendar, CalendarEvent
from .serializers import UserCalendarSerializer, CalendarEventSerializer

from .utils import sync_user_calendar_now, parse_ics_bytes
from django.db import transaction
from rest_framework.parsers import MultiPartParser, FormParser

class UserCalendarView(generics.RetrieveUpdateAPIView):
    serializer_class = UserCalendarSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        obj, _ = UserCalendar.objects.get_or_create(user=self.request.user)
        return obj

    def perform_update(self, serializer):
        old_obj = self.get_object()
        old_link = old_obj.source_link

        user_calendar = serializer.save()

        # If link changed → sync immediately
        new_link = user_calendar.source_link
        if new_link:
            result = sync_user_calendar_now(user_calendar)
            user_calendar.last_synced = timezone.now()
            user_calendar.save(update_fields=["last_synced"])

class UploadICSView(generics.CreateAPIView):
    """
    Upload an .ics file and parse into events for the current user (one-time import).
    """
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        file_obj = request.FILES.get("file")
        if not file_obj:
            return Response({"detail": "No file uploaded."}, status=status.HTTP_400_BAD_REQUEST)

        content = file_obj.read()
        events = parse_ics_bytes(content)

        # Save events (replace existing ones with same UID when present)
        created = 0
        updated = 0
        with transaction.atomic():
            for ev in events:
                if ev["uid"]:
                    e, created_flag = CalendarEvent.objects.update_or_create(
                        user=request.user,
                        source_uid=ev["uid"],
                        defaults={
                            "title": ev["summary"],
                            "description": ev["description"],
                            "location": ev["location"],
                            "start": ev["start"],
                            "end": ev["end"],
                            "raw_ics": ev["raw"],
                        }
                    )
                    if created_flag:
                        created += 1
                    else:
                        updated += 1
                else:
                    CalendarEvent.objects.create(
                        user=request.user,
                        source_uid=None,
                        title=ev["summary"],
                        description=ev["description"],
                        location=ev["location"],
                        start=ev["start"],
                        end=ev["end"],
                        raw_ics=ev["raw"]
                    )
                    created += 1

        return Response({"created": created, "updated": updated})

class ListEventsView(generics.ListAPIView):
    serializer_class = CalendarEventSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = CalendarEvent.objects.filter(user=user)

        # Optional filtering: date range
        start = self.request.query_params.get("start")
        end = self.request.query_params.get("end")
        if start:
            start_dt = timezone.datetime.fromisoformat(start)
            qs = qs.filter(end__gte=start_dt)
        if end:
            end_dt = timezone.datetime.fromisoformat(end)
            qs = qs.filter(start__lte=end_dt)
        return qs.order_by("start")
