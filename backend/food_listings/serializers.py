from rest_framework import serializers
from django.utils import timezone
from .models import FoodListing
from accounts.serializers import UserSerializer

class FoodListingSerializer(serializers.ModelSerializer):
    created_by_details = UserSerializer(source='created_by', read_only=True)
    is_expired = serializers.ReadOnlyField()
    is_expiring_soon = serializers.ReadOnlyField()
    
    class Meta:
        model = FoodListing
        fields = [
            'id', 'title', 'description', 'quantity', 'location', 
            'expiry_time', 'status', 'created_by', 'created_by_details',
            'created_at', 'updated_at', 'is_expired', 'is_expiring_soon'
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']
    
    def validate_expiry_time(self, value):
        if value <= timezone.now():
            raise serializers.ValidationError("Expiry time must be in the future")
        return value
    
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)

class FoodListingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodListing
        fields = ['id', 'title', 'description', 'quantity', 'location', 'expiry_time', 'status', 'created_at']
        read_only_fields = ['id', 'status', 'created_at']
    
    def validate_expiry_time(self, value):
        if value <= timezone.now():
            raise serializers.ValidationError("Expiry time must be in the future")
        return value

class FoodListingUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodListing
        fields = ['title', 'description', 'quantity', 'location', 'expiry_time', 'status']
    
    def validate_expiry_time(self, value):
        if value <= timezone.now():
            raise serializers.ValidationError("Expiry time must be in the future")
        return value