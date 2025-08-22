"""
URL configuration for food_donation project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

def api_root(request):
    return JsonResponse({
        'message': 'Food Waste Management API',
        'version': '1.0',
        'endpoints': {
            'auth': {
                'register': '/api/auth/register/',
                'login': '/api/auth/login/',
                'logout': '/api/auth/logout/',
                'profile': '/api/auth/profile/',
                'users': '/api/auth/users/',
            },
            'food': {
                'list_create': '/api/food/',
                'detail': '/api/food/{id}/',
                'available': '/api/food/available/',
                'stats': '/api/food/dashboard-stats/',
            },
            'requests': {
                'list_create': '/api/requests/',
                'detail': '/api/requests/{id}/',
                'my_requests': '/api/requests/my-requests/',
                'for_my_food': '/api/requests/for-my-food/',
            }
        }
    })

urlpatterns = [
    path('', api_root, name='api_root'),
    path('admin/', admin.site.urls),
    path('api/', api_root, name='api_root_api'),
    path('api/auth/', include('accounts.urls')),
    path('api/food/', include('food_listings.urls')),
    path('api/requests/', include('requests_app.urls')),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)