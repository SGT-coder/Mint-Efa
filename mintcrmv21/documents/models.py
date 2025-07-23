from django.db import models
from django.conf import settings
from cases.models import Case
from contacts.models import Contact

class Document(models.Model):
    DOCUMENT_TYPE_CHOICES = [
        ('contract', 'Contract'),
        ('pleading', 'Pleading'),
        ('correspondence', 'Correspondence'),
        ('evidence', 'Evidence'),
        ('research', 'Research'),
        ('template', 'Template'),
        ('other', 'Other'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    document_type = models.CharField(max_length=50, choices=DOCUMENT_TYPE_CHOICES)
    file = models.FileField(upload_to='documents/')
    case = models.ForeignKey(Case, on_delete=models.CASCADE, null=True, blank=True, related_name='documents')
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE, null=True, blank=True, related_name='documents')
    tags = models.CharField(max_length=500, blank=True, help_text="Comma-separated tags")
    is_confidential = models.BooleanField(default=False)
    version = models.CharField(max_length=20, default='1.0')
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title

class DocumentVersion(models.Model):
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='versions')
    version = models.CharField(max_length=20)
    file = models.FileField(upload_to='document_versions/')
    changes = models.TextField(blank=True)
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.document.title} v{self.version}"
