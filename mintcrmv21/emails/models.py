from django.db import models
from django.conf import settings
from cases.models import Case
from contacts.models import Contact

class Email(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('sent', 'Sent'),
        ('received', 'Received'),
        ('failed', 'Failed'),
    ]
    
    subject = models.CharField(max_length=200)
    body = models.TextField()
    from_email = models.EmailField()
    to_emails = models.TextField(help_text="Comma-separated email addresses")
    cc_emails = models.TextField(blank=True, help_text="Comma-separated email addresses")
    bcc_emails = models.TextField(blank=True, help_text="Comma-separated email addresses")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    case = models.ForeignKey(Case, on_delete=models.CASCADE, null=True, blank=True, related_name='emails')
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE, null=True, blank=True, related_name='emails')
    sent_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.subject

class EmailAttachment(models.Model):
    email = models.ForeignKey(Email, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(upload_to='email_attachments/')
    filename = models.CharField(max_length=200)
    
    def __str__(self):
        return f"{self.filename} - {self.email.subject}"
