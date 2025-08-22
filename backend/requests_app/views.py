from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Q

from .models import FoodRequest
from .serializers import (
    FoodRequestSerializer, 
    FoodRequestCreateSerializer,
    FoodRequestUpdateSerializer
)
from .permissions import IsRequesterOrFoodProviderOrAdmin
from food_listings.utils import send_request_notification

class FoodRequestListCreateView(generics.ListCreateAPIView):
    serializer_class = FoodRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        queryset = FoodRequest.objects.select_related('food_item', 'requested_by', 'food_item__created_by')
        
        # Filter based on user role
        if user.role == 'NGO/Volunteer':
            # NGOs see only their own requests
            queryset = queryset.filter(requested_by=user)
        elif user.role == 'FoodProvider':
            # Food providers see requests for their food items
            queryset = queryset.filter(food_item__created_by=user)
        # Admins see all requests
        
        # Apply filters
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        food_item_id = self.request.query_params.get('food_item')
        if food_item_id:
            queryset = queryset.filter(food_item_id=food_item_id)
        
        return queryset
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return FoodRequestCreateSerializer
        return FoodRequestSerializer
    
    def perform_create(self, serializer):
        # Only NGOs/Volunteers can create requests
        if self.request.user.role not in ['NGO/Volunteer', 'Admin']:
            raise permissions.PermissionDenied("Only NGOs/Volunteers can create food requests")
        
        request_obj = serializer.save()
        
        # Update food listing status to 'Requested'
        food_item = request_obj.food_item
        if food_item.status == 'Available':
            food_item.status = 'Requested'
            food_item.save()
        
        # Send notification emails
        send_request_notification(request_obj, 'created')

class FoodRequestDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = FoodRequest.objects.select_related('food_item', 'requested_by', 'food_item__created_by')
    permission_classes = [permissions.IsAuthenticated, IsRequesterOrFoodProviderOrAdmin]
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return FoodRequestUpdateSerializer
        return FoodRequestSerializer
    
    def perform_update(self, serializer):
        old_status = self.get_object().status
        request_obj = serializer.save()
        
        # Update food listing status based on request status
        food_item = request_obj.food_item
        if request_obj.status == 'Approved' and food_item.status == 'Requested':
            food_item.status = 'Collected'
            food_item.save()
        elif request_obj.status == 'Completed' and food_item.status == 'Collected':
            food_item.status = 'Distributed'
            food_item.save()
        elif request_obj.status == 'Rejected':
            # Check if there are other pending requests
            other_pending = FoodRequest.objects.filter(
                food_item=food_item, 
                status='Pending'
            ).exclude(id=request_obj.id).exists()
            
            if not other_pending:
                food_item.status = 'Available'
                food_item.save()
        
        # Send notification if status changed
        if old_status != request_obj.status:
            send_request_notification(request_obj, 'status_updated')

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def my_requests(request):
    """Get current user's food requests"""
    if request.user.role not in ['NGO/Volunteer', 'Admin']:
        return Response(
            {'error': 'Only NGOs/Volunteers can access this endpoint'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    requests = FoodRequest.objects.filter(
        requested_by=request.user
    ).select_related('food_item', 'food_item__created_by').order_by('-created_at')
    
    serializer = FoodRequestSerializer(requests, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def requests_for_my_food(request):
    """Get requests for current user's food listings"""
    if request.user.role not in ['FoodProvider', 'Admin']:
        return Response(
            {'error': 'Only Food Providers can access this endpoint'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    requests = FoodRequest.objects.filter(
        food_item__created_by=request.user
    ).select_related('food_item', 'requested_by').order_by('-created_at')
    
    serializer = FoodRequestSerializer(requests, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def bulk_update_requests(request):
    """Bulk update request statuses (Admin only)"""
    if request.user.role != 'Admin':
        return Response(
            {'error': 'Only Admins can perform bulk updates'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    request_ids = request.data.get('request_ids', [])
    new_status = request.data.get('status')
    
    if not request_ids or not new_status:
        return Response(
            {'error': 'request_ids and status are required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    updated_count = FoodRequest.objects.filter(
        id__in=request_ids
    ).update(status=new_status)
    
    return Response({
        'message': f'Updated {updated_count} requests to {new_status}',
        'updated_count': updated_count
    })