from django.conf import settings
from accounts.utils import send_notification_email

def send_listing_notification(listing, action, old_status=None):
    """Send notification emails for food listing actions"""
    
    if action == 'created':
        # Notify the food provider
        send_notification_email(
            user=listing.created_by,
            subject=f'Food Listing Created: {listing.title}',
            template_name='food_listing_created.html',
            context={
                'listing': listing,
                'action': 'created'
            }
        )
    
    elif action == 'status_updated':
        # Notify the food provider about status change
        send_notification_email(
            user=listing.created_by,
            subject=f'Food Listing Status Updated: {listing.title}',
            template_name='food_listing_status_updated.html',
            context={
                'listing': listing,
                'old_status': old_status,
                'new_status': listing.status
            }
        )
    
    elif action == 'expiring_soon':
        # Notify about expiring food
        send_notification_email(
            user=listing.created_by,
            subject=f'Food Item Expiring Soon: {listing.title}',
            template_name='food_listing_expiring.html',
            context={
                'listing': listing
            }
        )

def send_request_notification(request_obj, action):
    """Send notification emails for food request actions"""
    
    if action == 'created':
        # Notify the food provider about new request
        send_notification_email(
            user=request_obj.food_item.created_by,
            subject=f'New Food Request: {request_obj.food_item.title}',
            template_name='food_request_created.html',
            context={
                'request': request_obj,
                'requester': request_obj.requested_by,
                'listing': request_obj.food_item
            }
        )
        
        # Notify the requester about successful submission
        send_notification_email(
            user=request_obj.requested_by,
            subject=f'Food Request Submitted: {request_obj.food_item.title}',
            template_name='food_request_submitted.html',
            context={
                'request': request_obj,
                'listing': request_obj.food_item
            }
        )
    
    elif action == 'status_updated':
        # Notify the requester about status change
        send_notification_email(
            user=request_obj.requested_by,
            subject=f'Food Request {request_obj.status}: {request_obj.food_item.title}',
            template_name='food_request_status_updated.html',
            context={
                'request': request_obj,
                'listing': request_obj.food_item
            }
        )