from django.db import models
from django.conf import settings
from cases.models import Case
from contacts.models import Contact

class Meeting(models.Model):
    MEETING_TYPE_CHOICES = [
        ('consultation', 'Consultation'),
        ('deposition', 'Deposition'),
        ('court_hearing', 'Court Hearing'),
        ('client_meeting', 'Client Meeting'),
        ('team_meeting', 'Team Meeting'),
        ('other', 'Other'),
    ]
    
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('rescheduled', 'Rescheduled'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    meeting_type = models.CharField(max_length=50, choices=MEETING_TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    location = models.CharField(max_length=200, blank=True)
    meeting_url = models.URLField(blank=True)
    case = models.ForeignKey(Case, on_delete=models.CASCADE, null=True, blank=True, related_name='meetings')
    organizer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='organized_meetings')
    attendees = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True, related_name='meetings')
    external_attendees = models.ManyToManyField(Contact, blank=True, related_name='meetings')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['start_time']
    
    def __str__(self):
        return f"{self.title} - {self.start_time}"

class MeetingNote(models.Model):
    meeting = models.ForeignKey(Meeting, on_delete=models.CASCADE, related_name='meeting_notes')
    note = models.TextField()
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Note for {self.meeting} by {self.created_by}"
