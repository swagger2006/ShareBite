from django.urls import path
from . import views

urlpatterns = [
    path('', views.FoodRequestListCreateView.as_view(), name='food_request_list_create'),
    path('<int:pk>/', views.FoodRequestDetailView.as_view(), name='food_request_detail'),
    path('my-requests/', views.my_requests, name='my_requests'),
    path('for-my-food/', views.requests_for_my_food, name='requests_for_my_food'),
    path('bulk-update/', views.bulk_update_requests, name='bulk_update_requests'),
]