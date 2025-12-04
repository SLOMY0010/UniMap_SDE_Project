from django.test import SimpleTestCase
from django.apps import apps
from booking.apps import BookingConfig

class BookingAppsTest(SimpleTestCase):
    def test_booking_config_importable(self):
        # import succeeded if we have this class
        self.assertIsNotNone(BookingConfig)

    def test_booking_config_name(self):
        self.assertEqual(BookingConfig.name, 'booking')

    def test_booking_default_auto_field(self):
        self.assertEqual(BookingConfig.default_auto_field, 'django.db.models.BigAutoField')

    def test_booking_registered_in_apps(self):
        config = apps.get_app_config('booking')
        self.assertEqual(config.name, BookingConfig.name)
