from django.urls import path
from . import views

urlpatterns = [
    path('', views.DocumentListCreateView.as_view(), name='document-list'),
    path('<int:pk>/', views.DocumentDetailView.as_view(), name='document-detail'),
    path('<int:document_id>/versions/', views.upload_document_version, name='upload-document-version'),
]
