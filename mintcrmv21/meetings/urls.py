from django.urls import path
from . import views

urlpatterns = [
    path('', views.MeetingListCreateView.as_view(), name='meeting-list'),
    path('<int:pk>/', views.MeetingDetailView.as_view(), name='meeting-detail'),
    path('<int:meeting_id>/notes/', views.add_meeting_note, name='add-meeting-note'),
    path('my-meetings/', views.my_meetings, name='my-meetings'),
]
