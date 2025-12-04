from django.test import SimpleTestCase
from django.apps import apps
from uni.apps import UniConfig  # :contentReference[oaicite:6]{index=6}

class UniAppsTest(SimpleTestCase):
    def test_importable(self):
        self.assertIsNotNone(UniConfig)

    def test_name(self):
        self.assertEqual(UniConfig.name, 'uni')

    def test_default_auto_field(self):
        self.assertEqual(UniConfig.default_auto_field, 'django.db.models.BigAutoField')

    def test_registered(self):
        config = apps.get_app_config('uni')
        self.assertEqual(config.name, UniConfig.name)
