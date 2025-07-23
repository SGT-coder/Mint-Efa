from django.urls import path
from . import views

urlpatterns = [
    path('', views.ReportListCreateView.as_view(), name='report-list'),
    path('<int:pk>/', views.ReportDetailView.as_view(), name='report-detail'),
    path('<int:report_id>/generate/', views.generate_report, name='generate-report'),
    path('dashboard-stats/', views.dashboard_stats, name='dashboard-stats'),
]
