from django.db import models
from django.contrib.auth import get_user_model
from food_listings.models import FoodListing

User = get_user_model()

class FoodRequest(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Completed', 'Completed'),
        ('Rejected', 'Rejected'),
    ]
    
    food_item = models.ForeignKey(FoodListing, on_delete=models.CASCADE, related_name='requests')
    requested_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='food_requests')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    message = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'food_requests'
        ordering = ['-created_at']
        unique_together = ['food_item', 'requested_by']  # Prevent duplicate requests
    
    def __str__(self):
        return f"Request for {self.food_item.title} by {self.requested_by.full_name}"