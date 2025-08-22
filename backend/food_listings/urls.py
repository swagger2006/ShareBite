from django.urls import path
from . import views

urlpatterns = [
    path('', views.FoodListingListCreateView.as_view(), name='food_listing_list_create'),
    path('<int:pk>/', views.FoodListingDetailView.as_view(), name='food_listing_detail'),
    path('dashboard-stats/', views.dashboard_stats, name='dashboard_stats'),
    path('available/', views.available_food, name='available_food'),
]