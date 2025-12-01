from rest_framework.serializers import ModelSerializer, ValidationError
from .models import *


class BookingSerializer(ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


    def update(self, instance, validated_data):

        # Check if user changed status
        old_status = getattr(instance, 'status')

        if old_status != Booking.STATUS_PENDING:
            raise ValidationError({"message": "You cannot change the status of this booking."})

        IMMUTABLE_FIELDS = ['purpose', 'room', 'start_time', 'end_time', 'date']
        for field in IMMUTABLE_FIELDS:
            if field in validated_data:
                old_val = getattr(instance, field)
                new_val = validated_data[field]
                if old_val != new_val:
                    raise ValidationError({
                        field: f"You cannot modify {field} after creation."
                    })
                


        return super().update(instance, validated_data)
    