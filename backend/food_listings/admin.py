from django.contrib import admin
from .models import FoodListing

@admin.register(FoodListing)
class FoodListingAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_by', 'quantity', 'location', 'status', 'expiry_time', 'created_at')
    list_filter = ('status', 'created_at', 'expiry_time')
    search_fields = ('title', 'description', 'location', 'created_by__full_name')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'quantity', 'location')
        }),
        ('Status & Timing', {
            'fields': ('status', 'expiry_time')
        }),
        ('Metadata', {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )