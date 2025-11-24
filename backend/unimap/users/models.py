from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

# Create your models here.
class User(AbstractUser):
    class Meta:
        ordering = ['id']

    def __str__(self):
        return f"{self.id}. {self.email}"

# For tokens expiration    
class RevokedToken(models.Model):
    token = models.TextField(unique=True)   # store the full token or its signature
    revoked_at = models.DateTimeField(default=timezone.now)
    expires_at = models.DateTimeField(db_index=True)

    class Meta:
        ordering = ['-revoked_at']

    def __str__(self):
        return f"RevokedToken(revoked_at={self.revoked_at}, expires_at={self.expires_at})"
