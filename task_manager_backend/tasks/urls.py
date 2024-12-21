from django.urls import path
from . import views
from rest_framework_simplejwt import views as jwt_views

urlpatterns = [
    path('auth/register/', views.UserRegistrationView.as_view(), name='register'),
    path('auth/login/', views.CustomLoginView.as_view(), name='login'),
    path('tasks/', views.TaskListView.as_view(), name='task_list'),
    path('tasks/<int:pk>/', views.TaskDetailView.as_view(), name='task_update'),
    path('tasks/<int:pk>/delete/', views.TaskDetailView.as_view(), name='task_delete'),
]
