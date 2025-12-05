from rest_framework.serializers import ModelSerializer
from .models import *

class CampusSerializer(ModelSerializer):
    class Meta:
        model = Campus
        fields = '__all__'

class BuildingSerializer(ModelSerializer):
    class Meta:
        model = Building
        fields = '__all__'

class RoomSerializer(ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'

class FloorMapSerializer(ModelSerializer):
    class Meta:
        model = FloorMap
        fields = '__all__'