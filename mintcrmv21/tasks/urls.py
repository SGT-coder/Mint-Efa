from django.urls import path
from . import views

urlpatterns = [
    path('', views.TaskListCreateView.as_view(), name='task-list'),
    path('<int:pk>/', views.TaskDetailView.as_view(), name='task-detail'),
    path('<int:task_id>/comments/', views.add_task_comment, name='add-task-comment'),
    path('my-tasks/', views.my_tasks, name='my-tasks'),
]
