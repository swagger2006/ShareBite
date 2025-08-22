from rest_framework import permissions

class IsRequesterOrFoodProviderOrAdmin(permissions.BasePermission):
    """
    Custom permission to allow:
    - Requesters to view their own requests
    - Food providers to view/update requests for their food items
    - Admins to view/update any request
    """
    
    def has_object_permission(self, request, view, obj):
        user = request.user
        
        # Admins can do anything
        if user.role == 'Admin':
            return True
        
        # Requesters can view their own requests
        if obj.requested_by == user:
            return request.method in permissions.SAFE_METHODS
        
        # Food providers can view/update requests for their food items
        if obj.food_item.created_by == user:
            return True
        
        return False