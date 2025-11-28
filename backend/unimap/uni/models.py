from django.db import models

# Create your models here.
class Campus(models.Model):
    name = models.CharField(max_length=100, null=False, blank=False)
    address = models.CharField(max_length=200, null=False, blank=False)
    maps_url = models.URLField(null=False, blank=False)
    image = models.ImageField(upload_to='images/campuses', null=True, blank=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.id}. {self.name}"

class Building(models.Model):
    name = models.CharField(max_length=100, null=False, blank=False)
    campus = models.ForeignKey(Campus, related_name='buildings', on_delete=models.CASCADE)
    address = models.CharField(max_length=200, null=False, blank=False)
    maps_url = models.URLField(null=False, blank=False)
    floors_num = models.PositiveIntegerField()

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.id}. {self.name}"

ROOM_TYPES = {
    "lecture hall": "Lecture Hall",
    "laboratory": "Laboratory",
    "seminar room": "Seminar Room",
    "female washroom": "Female Washroom",
    "male washroom": "Male Washroom",
    "cafeteria": "Cafeteria"
}

class Alias(models.Model):
    campus = models.ForeignKey(Campus, on_delete=models.CASCADE, related_name='aliases', null=True, blank=True)
    building = models.ForeignKey(Building, on_delete=models.CASCADE, related_name='aliases', null=True, blank=True)

    alias = models.CharField(max_length=200)

    class Meta:
        unique_together = ('alias', 'building', 'campus')

class Room(models.Model):
    name = models.CharField(max_length=50)
    type = models.CharField(max_length=50, choices=ROOM_TYPES)
    floor = models.SmallIntegerField()
    building = models.ForeignKey(Building, related_name='rooms', on_delete=models.CASCADE)

    class Meta:
        ordering = ['floor', 'name']

    def __str__(self):
        return f"Room: {self.name}, Floor: {self.floor} "
