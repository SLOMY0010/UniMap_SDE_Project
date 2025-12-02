# class_schedule/models.py
import secrets
from django.conf import settings
from django.db import models
from django.utils import timezone


def generate_token():
    # URL-safe token, reasonably long
    return secrets.token_urlsafe(48)


class UserCalendar(models.Model):
    """
    One row per user storing the source ICS link (or none), a feed token,
    and last sync metadata.
    """
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="calendar")
    source_link = models.URLField(blank=True, null=True, help_text="Original university .ics feed link (optional)")
    token = models.CharField(max_length=128, unique=True, default=generate_token)
    last_synced = models.DateTimeField(blank=True, null=True)
    enabled = models.BooleanField(default=True)

    def regenerate_token(self):
        self.token = generate_token()
        self.save(update_fields=["token"])

    def __str__(self):
        return f"Calendar for {self.user}"


class CalendarEvent(models.Model):
    """
    Stores parsed events per user. We store a unique source_uid when possible
    to allow updates when source changes.
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="calendar_events")
    source_uid = models.CharField(max_length=512, blank=True, null=True, help_text="UID from the source VEVENT if present")
    title = models.CharField(max_length=512)
    description = models.TextField(blank=True)
    location = models.CharField(max_length=512, blank=True)
    start = models.DateTimeField()
    end = models.DateTimeField()
    raw_ics = models.TextField(blank=True, help_text="Optional raw VEVENT text for debugging")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["user", "start"]),
            models.Index(fields=["user", "source_uid"]),
        ]
        ordering = ["start"]

    def __str__(self):
        return f"{self.title} ({self.start.isoformat()} - {self.end.isoformat()})"
