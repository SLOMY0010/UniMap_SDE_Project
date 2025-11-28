from  .models import *
from .serializers import *
from rest_framework import generics, mixins
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.db.models import Q

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
    

class UniSearchView(APIView):
    def get(self, request):
        query = request.query_params.get("q", "").strip()

        if not query:
            return Response({
                "error": "Query parameter 'q' is required."
            }, status=status.HTTP_400_BAD_REQUEST)

        # Search Campuses
        campuses = Campus.objects.filter(
            Q(name__icontains=query) |
            Q(aliases__alias__icontains=query)
        ).distinct()

        # Search Buildings
        buildings = Building.objects.filter(
            Q(name__icontains=query) |
            Q(aliases__alias__icontains=query)
        ).distinct()

        # Search Rooms
        rooms = Room.objects.filter(
            Q(name__icontains=query) |
            Q(aliases__alias__icontains=query)
        ).distinct()

        return Response({
            "campuses": CampusSerializer(campuses, many=True).data,
            "buildings": BuildingSerializer(buildings, many=True).data,
            "rooms": RoomSerializer(rooms, many=True).data,
        })
    