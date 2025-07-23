from django.urls import path
from . import views

urlpatterns = [
    path('', views.ContactListCreateView.as_view(), name='contact-list'),
    path('<int:pk>/', views.ContactDetailView.as_view(), name='contact-detail'),
    path('<int:contact_id>/notes/', views.add_contact_note, name='add-contact-note'),
]
