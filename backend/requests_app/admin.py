from django.contrib import admin
from .models import FoodRequest

@admin.register(FoodRequest)
class FoodRequestAdmin(admin.ModelAdmin):
    list_display = ('food_item', 'requested_by', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('food_item__title', 'requested_by__full_name', 'message')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Request Information', {
            'fields': ('food_item', 'requested_by', 'status', 'message')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )