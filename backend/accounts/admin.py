from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'full_name', 'role', 'organization', 'is_active', 'created_at')
    list_filter = ('role', 'is_active', 'is_email_verified', 'created_at')
    search_fields = ('email', 'full_name', 'organization')
    ordering = ('-created_at',)
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Additional Info', {
            'fields': ('full_name', 'role', 'organization', 'phone', 'address', 'is_email_verified')
        }),
    )
    
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Additional Info', {
            'fields': ('email', 'full_name', 'role', 'organization', 'phone', 'address')
        }),
    )