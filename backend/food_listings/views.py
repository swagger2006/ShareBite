from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Q
from django.utils import timezone

from .models import FoodListing
from .serializers import (
    FoodListingSerializer, 
    FoodListingCreateSerializer,
    FoodListingUpdateSerializer
)
from .permissions import IsFoodProviderOrAdmin, IsOwnerOrAdmin
from .utils import send_listing_notification

class FoodListingListCreateView(generics.ListCreateAPIView):
    serializer_class = FoodListingSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = FoodListing.objects.select_related('created_by')
        
        # Filter based on user role
        user = self.request.user
        if user.role == 'FoodProvider':
            # Food providers see only their own listings
            queryset = queryset.filter(created_by=user)
        elif user.role == 'NGO/Volunteer':
            # NGOs see only available listings
            queryset = queryset.filter(status='Available')
        # Admins see all listings
        
        # Apply filters
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | 
                Q(description__icontains=search) |
                Q(location__icontains=search)
            )
        
        return queryset
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return FoodListingCreateSerializer
        return FoodListingSerializer
    
    def perform_create(self, serializer):
        # STRICT ROLE SEPARATION: Only Food Providers can create listings
        # NGO/Volunteers can only request food, Individuals can only request food
        if self.request.user.role not in ['FoodProvider', 'Admin']:
            raise permissions.PermissionDenied(
                f"Users with role '{self.request.user.role}' cannot create food listings. "
                "Only Food Providers and Admins can create listings. "
                f"{'NGO/Volunteers and Individuals can only request food.' if self.request.user.role in ['NGO/Volunteer', 'Individual'] else ''}"
            )

        listing = serializer.save(created_by=self.request.user)
        
        # Send notification email
        send_listing_notification(listing, 'created')

class FoodListingDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = FoodListing.objects.select_related('created_by')
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return FoodListingUpdateSerializer
        return FoodListingSerializer
    
    def perform_update(self, serializer):
        old_status = self.get_object().status
        listing = serializer.save()
        
        # Send notification if status changed
        if old_status != listing.status:
            send_listing_notification(listing, 'status_updated', old_status)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def dashboard_stats(request):
    """Get dashboard statistics for the current user"""
    user = request.user
    
    if user.role == 'FoodProvider':
        my_listings = FoodListing.objects.filter(created_by=user)
        stats = {
            'active_listings': my_listings.exclude(status='Distributed').count(),
            'total_distributed': my_listings.filter(status='Distributed').count(),
            'expiring_soon': my_listings.filter(
                expiry_time__lte=timezone.now() + timezone.timedelta(hours=24),
                expiry_time__gt=timezone.now(),
                status='Available'
            ).count(),
        }
    elif user.role == 'NGO/Volunteer':
        available_listings = FoodListing.objects.filter(status='Available')
        stats = {
            'available_food': available_listings.count(),
            'expiring_soon': available_listings.filter(
                expiry_time__lte=timezone.now() + timezone.timedelta(hours=24),
                expiry_time__gt=timezone.now()
            ).count(),
        }
    else:  # Admin
        all_listings = FoodListing.objects.all()
        stats = {
            'total_listings': all_listings.count(),
            'active_listings': all_listings.exclude(status='Distributed').count(),
            'distributed': all_listings.filter(status='Distributed').count(),
            'expired': all_listings.filter(expiry_time__lt=timezone.now()).count(),
        }
    
    return Response(stats)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def available_food(request):
    """Get available food listings for NGOs/Volunteers"""
    if request.user.role not in ['NGO/Volunteer', 'Admin']:
        return Response(
            {'error': 'Only NGOs/Volunteers can access this endpoint'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    listings = FoodListing.objects.filter(
        status='Available',
        expiry_time__gt=timezone.now()
    ).select_related('created_by').order_by('expiry_time')
    
    serializer = FoodListingSerializer(listings, many=True)
    return Response(serializer.data)