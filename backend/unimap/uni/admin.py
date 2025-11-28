from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(Campus)
admin.site.register(Building)
admin.site.register(Room)
admin.site.register(CampusAlias)
admin.site.register(BuildingAlias)
admin.site.register(RoomAlias)
admin.site.register(FloorMap)