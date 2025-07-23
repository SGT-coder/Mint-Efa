from django.db import models
from django.conf import settings
from contacts.models import Contact

class ClientPortalAccess(models.Model):
    contact = models.OneToOneField(Contact, on_delete=models.CASCADE, related_name='portal_access')
    username = models.CharField(max_length=150, unique=True)
    password_hash = models.CharField(max_length=128)
    is_active = models.BooleanField(default=True)
    last_login = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Portal access for {self.contact}"

class PortalRequest(models.Model):
    REQUEST_TYPE_CHOICES = [
        ('document', 'Document Request'),
        ('meeting', 'Meeting Request'),
        ('information', 'Information Request'),
        ('support', 'Support Request'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE, related_name='portal_requests')
    request_type = models.CharField(max_length=50, choices=REQUEST_TYPE_CHOICES)
    subject = models.CharField(max_length=200)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    response = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.subject} - {self.contact}"

class PortalDocument(models.Model):
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE, related_name='portal_documents')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    document = models.FileField(upload_to='portal_documents/')
    is_public = models.BooleanField(default=False)
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.title} - {self.contact}"
