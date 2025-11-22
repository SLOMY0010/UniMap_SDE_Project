from django.shortcuts import render
from  .models import *
from .serializers import *
from rest_framework import generics, mixins
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

# Create your views here.
class CampusView(mixins.ListModelMixin, mixins.RetrieveModelMixin, generics.GenericAPIView):
    serializer_class = CampusSerializer
    queryset = Campus.objects.all()
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        if "pk" in kwargs:
            return self.retrieve(request, *args, **kwargs)
        return self.list(request, *args, **kwargs)

class BuildingView(mixins.ListModelMixin, mixins.RetrieveModelMixin, generics.GenericAPIView):
    serializer_class = BuildingSerializer
    queryset = Building.objects.all()
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        if "pk" in kwargs:
            return self.retrieve(request, *args, **kwargs)
        return self.list(request, *args, **kwargs)

class RoomView(mixins.ListModelMixin, mixins.RetrieveModelMixin, generics.GenericAPIView):
    serializer_class = RoomSerializer
    queryset = Room.objects.all()
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        if "pk" in kwargs:
            return self.retrieve(request, *args, **kwargs)
        return self.list(request, *args, **kwargs)
    