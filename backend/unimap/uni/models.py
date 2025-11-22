from django.db import models

# Create your models here.
class Campus(models.Model):
    name = models.CharField(max_length=100, null=False, blank=False)
    address = models.CharField(max_length=200, null=False, blank=False)
    maps_url = models.URLField(null=False, blank=False)
    image = models.ImageField(upload_to='images/campuses')

    class Meta:
        ordering = ['name']

class Building(models.Model):
    name = models.CharField(max_length=100, null=False, blank=False)
    campus = models.ForeignKey(Campus, related_name='buildings')
    address = models.CharField(max_length=200, null=False, blank=False)
    maps_url = models.URLField(null=False, blank=False)

    class Meta:
        ordering = ['name']

class Room(models.Model):
    name = models.CharField(max_length=50)
    type = models.CharField(max_length=50)
    floor = models.SmallIntegerField()
    building = models.ForeignKey(Building, related_name='rooms')

    class Meta:
        ordering = ['floor', 'name']
