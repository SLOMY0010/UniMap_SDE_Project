from django.test import SimpleTestCase
from django.apps import apps
from users.apps import UsersConfig

class UsersAppsTest(SimpleTestCase):
    def test_importable(self):
        self.assertIsNotNone(UsersConfig)

    def test_name(self):
        self.assertEqual(UsersConfig.name, 'users')

    def test_default_auto_field(self):
        self.assertEqual(UsersConfig.default_auto_field, 'django.db.models.BigAutoField')

    def test_registered(self):
        config = apps.get_app_config('users')
        self.assertEqual(config.name, UsersConfig.name)
