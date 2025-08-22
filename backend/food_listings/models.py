from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()

class FoodListing(models.Model):
    STATUS_CHOICES = [
        ('Available', 'Available'),
        ('Requested', 'Requested'),
        ('Collected', 'Collected'),
        ('Distributed', 'Distributed'),
    ]
    
    title = models.CharField(max_length=255)
    description = models.TextField()
    quantity = models.PositiveIntegerField(default=1)
    location = models.CharField(max_length=255)
    expiry_time = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Available')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='food_listings')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'food_listings'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.status}"
    
    @property
    def is_expired(self):
        return timezone.now() > self.expiry_time
    
    @property
    def is_expiring_soon(self):
        time_diff = self.expiry_time - timezone.now()
        return time_diff.total_seconds() <= 24 * 3600 and time_diff.total_seconds() > 0