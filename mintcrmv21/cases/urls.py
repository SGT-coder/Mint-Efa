from django.urls import path
from . import views

urlpatterns = [
    path('', views.CaseListCreateView.as_view(), name='case-list'),
    path('<int:pk>/', views.CaseDetailView.as_view(), name='case-detail'),
    path('<int:case_id>/notes/', views.add_case_note, name='add-case-note'),
    path('<int:case_id>/documents/', views.upload_case_document, name='upload-case-document'),
]
