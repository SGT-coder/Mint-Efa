from django.urls import path
from . import views

urlpatterns = [
    path('', views.WorkflowListCreateView.as_view(), name='workflow-list'),
    path('<int:pk>/', views.WorkflowDetailView.as_view(), name='workflow-detail'),
    path('<int:workflow_id>/steps/', views.WorkflowStepListCreateView.as_view(), name='workflow-step-list'),
    path('<int:workflow_id>/executions/', views.WorkflowExecutionListView.as_view(), name='workflow-execution-list'),
]
