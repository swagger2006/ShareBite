from rest_framework import serializers
from .models import FoodRequest
from food_listings.serializers import FoodListingSerializer
from accounts.serializers import UserSerializer

class FoodRequestSerializer(serializers.ModelSerializer):
    food_item_details = FoodListingSerializer(source='food_item', read_only=True)
    requested_by_details = UserSerializer(source='requested_by', read_only=True)
    
    class Meta:
        model = FoodRequest
        fields = [
            'id', 'food_item', 'food_item_details', 'requested_by', 
            'requested_by_details', 'status', 'message', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'requested_by', 'created_at', 'updated_at']

class FoodRequestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodRequest
        fields = ['food_item', 'message']
    
    def validate_food_item(self, value):
        # Check if food item is available
        if value.status != 'Available':
            raise serializers.ValidationError("This food item is no longer available")
        
        # Check if user already requested this item
        user = self.context['request'].user
        if FoodRequest.objects.filter(food_item=value, requested_by=user).exists():
            raise serializers.ValidationError("You have already requested this food item")
        
        return value
    
    def create(self, validated_data):
        validated_data['requested_by'] = self.context['request'].user
        return super().create(validated_data)

class FoodRequestUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodRequest
        fields = ['status']
    
    def validate_status(self, value):
        # Only food providers and admins can update status
        user = self.context['request'].user
        food_request = self.instance
        
        if user.role not in ['Admin'] and user != food_request.food_item.created_by:
            raise serializers.ValidationError("You don't have permission to update this request")
        
        return value