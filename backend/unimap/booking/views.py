from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import mixins, generics
from .models import *
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .serializers import *
from django.db.models import Q
from rest_framework import status


# Create your views here.
class BookingView(mixins.ListModelMixin, mixins.CreateModelMixin, generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = BookingSerializer

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)
    
    def perform_create(self, serializer):
        data = serializer.validated_data

        start = data['start_time']
        end = data['end_time']
        room = data['room']
        user = self.request.user


        # Check for conflicts
        conflicts = Booking.objects.filter(
            Q(start_time__lt=end) & Q(end_time__gt=start),
            room=room,
            status="approved"
        )

        if conflicts.exists():
            raise ValidationError({"message": "Room already booked."})

        user = self.request.user

        # Check for user conflicts
        conflicts = Booking.objects.filter(
            Q(start_time__lt=end) & Q(end_time__gt=start),
            user=user
        )
        if conflicts.exists():
            raise ValidationError({"message": "You can't be in two places at once."})

        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        validated_data = serializer.validated_data
        status = validated_data.get('status', '')
        if status == Booking.STATUS_APPROVED or status == Booking.STATUS_REJECTED:
            raise ValidationError({"message": "You are not an admin."})
            
        return super().perform_update(serializer)


class AdminBookingView(generics.ListAPIView, generics.RetrieveUpdateDestroyAPIView):
    queryset = Booking.objects.all()
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = BookingSerializer

    def perform_update(self, serializer):
        validated_data = serializer.validated_data
        status = validated_data.get('status', '')
        if status == Booking.STATUS_CANCELLED:
            raise ValidationError({"message": "You cannot cancel a booking, you can reject it."})
            
        return super().perform_update(serializer)