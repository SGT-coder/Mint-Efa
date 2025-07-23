from django.urls import path
from . import views

urlpatterns = [
    path('requests/', views.PortalRequestListCreateView.as_view(), name='portal-request-list'),
    path('requests/<int:pk>/', views.PortalRequestDetailView.as_view(), name='portal-request-detail'),
    path('documents/', views.PortalDocumentListCreateView.as_view(), name='portal-document-list'),
    path('documents/<int:pk>/', views.PortalDocumentDetailView.as_view(), name='portal-document-detail'),
    path('submit-request/', views.submit_portal_request, name='submit-portal-request'),
]
