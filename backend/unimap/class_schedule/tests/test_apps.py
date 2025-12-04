from django.test import SimpleTestCase
from django.apps import apps
from class_schedule.apps import ClassScheduleConfig

class ClassScheduleAppsTest(SimpleTestCase):
    def test_importable(self):
        self.assertIsNotNone(ClassScheduleConfig)

    def test_name(self):
        self.assertEqual(ClassScheduleConfig.name, 'class_schedule')

    def test_default_auto_field(self):
        self.assertEqual(ClassScheduleConfig.default_auto_field, 'django.db.models.BigAutoField')

    def test_registered(self):
        config = apps.get_app_config('class_schedule')
        self.assertEqual(config.name, ClassScheduleConfig.name)
