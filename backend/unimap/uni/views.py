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
            return Response({"error": "Query parameter 'q' is required."}, status=400)

        # STEP 1 — Search Rooms
        rooms = Room.objects.filter(
            Q(name__icontains=query) |
            Q(aliases__name__icontains=query)
        ).distinct()

        if rooms.exists():
            # Build parent building + campus sets
            buildings = Building.objects.filter(id__in=rooms.values("building_id")).distinct()
            campuses = Campus.objects.filter(id__in=buildings.values("campus_id")).distinct()

            return Response({
                "campuses": CampusSerializer(campuses, many=True).data,
                "buildings": BuildingSerializer(buildings, many=True).data,
                "rooms": RoomSerializer(rooms, many=True).data,
                "matched_type": "room"
            })

        # STEP 2 — Search Buildings (only if no rooms matched)
        buildings = Building.objects.filter(
            Q(name__icontains=query) |
            Q(aliases__name__icontains=query)
        ).distinct()

        if buildings.exists():
            campuses = Campus.objects.filter(id__in=buildings.values("campus_id")).distinct()

            return Response({
                "campuses": CampusSerializer(campuses, many=True).data,
                "buildings": BuildingSerializer(buildings, many=True).data,
                "rooms": [],  # no rooms
                "matched_type": "building"
            })

        # STEP 3 — Search Campuses (only if no rooms or buildings matched)
        campuses = Campus.objects.filter(
            Q(name__icontains=query) |
            Q(aliases__name__icontains=query)
        ).distinct()

        if campuses.exists():
            return Response({
                "campuses": CampusSerializer(campuses, many=True).data,
                "buildings": [],
                "rooms": [],
                "matched_type": "campus"
            })

        # Nothing matched
        return Response({
            "campuses": [],
            "buildings": [],
            "rooms": [],
            "matched_type": None
        })