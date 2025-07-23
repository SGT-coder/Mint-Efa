from django.urls import path
from . import views

urlpatterns = [
    path('', views.EmailListCreateView.as_view(), name='email-list'),
    path('<int:pk>/', views.EmailDetailView.as_view(), name='email-detail'),
    path('<int:email_id>/send/', views.send_email, name='send-email'),
    path('<int:email_id>/attachments/', views.add_email_attachment, name='add-email-attachment'),
]
