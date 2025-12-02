# class_schedule/utils.py
import logging
from datetime import datetime, date
from io import BytesIO

import requests
from icalendar import Calendar, Event
from dateutil import parser as date_parser
from django.utils import timezone

logger = logging.getLogger(__name__)


def fetch_ics(url, timeout=15):
    """
    Fetch ICS content from URL. Raises requests exceptions on failures.
    """
    resp = requests.get(url, timeout=timeout)
    resp.raise_for_status()
    return resp.content


def parse_ics_bytes(ics_bytes, default_tz=None):
    """
    Parse ICS bytes (or str) into a list of event dicts:
    {
      'uid': str or None,
      'summary': str,
      'description': str,
      'location': str,
      'start': datetime,
      'end': datetime,
      'raw': str
    }
    """
    if isinstance(ics_bytes, bytes):
        ics_bytes = ics_bytes.decode("utf-8", errors="ignore")

    cal = Calendar.from_ical(ics_bytes)
    events = []

    for component in cal.walk():
        if component.name != "VEVENT":
            continue

        uid = component.get("uid")
        summary = str(component.get("summary") or "")
        description = str(component.get("description") or "")
        location = str(component.get("location") or "")

        # DTSTART and DTEND can be date or datetime
        dtstart = component.get("dtstart").dt if component.get("dtstart") else None
        dtend = component.get("dtend").dt if component.get("dtend") else None

        # if only date provided, convert to datetimes (midnight-based)
        if isinstance(dtstart, date) and not isinstance(dtstart, datetime):
            dtstart = datetime.combine(dtstart, datetime.min.time())
        if isinstance(dtend, date) and not isinstance(dtend, datetime):
            dtend = datetime.combine(dtend, datetime.min.time())

        # If site returns naive datetimes, assume default_tz or settings.TIME_ZONE
        if dtstart and dtstart.tzinfo is None:
            if default_tz:
                dtstart = default_tz.localize(dtstart)
            else:
                dtstart = timezone.make_aware(dtstart, timezone.get_default_timezone())

        if dtend and dtend.tzinfo is None:
            if default_tz:
                dtend = default_tz.localize(dtend)
            else:
                dtend = timezone.make_aware(dtend, timezone.get_default_timezone())

        # Fallback: if dtend missing, try duration or use dtstart + 1h
        if not dtend:
            duration = component.get("duration")
            if duration:
                dtend = dtstart + duration.dt
            else:
                # default one hour
                dtend = dtstart + timezone.timedelta(hours=1)

        events.append({
            "uid": str(uid) if uid else None,
            "summary": summary,
            "description": description,
            "location": location,
            "start": dtstart,
            "end": dtend,
            "raw": component.to_ical().decode("utf-8", errors="ignore")
        })

    return events
