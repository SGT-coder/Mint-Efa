from django.db import models
from django.conf import settings

class Contact(models.Model):
    CONTACT_TYPE_CHOICES = [
        ('individual', 'Individual'),
        ('organization', 'Organization'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('prospect', 'Prospect'),
    ]
    
    type = models.CharField(max_length=20, choices=CONTACT_TYPE_CHOICES, default='individual')
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100, blank=True)
    company = models.CharField(max_length=200, blank=True)
    title = models.CharField(max_length=100, blank=True)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    mobile = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    zip_code = models.CharField(max_length=20, blank=True)
    country = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    notes = models.TextField(blank=True)
    tags = models.CharField(max_length=500, blank=True, help_text="Comma-separated tags")
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_contacts')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        if self.type == 'organization':
            return self.company
        return f"{self.first_name} {self.last_name}"

class ContactNote(models.Model):
    contact = models.ForeignKey(Contact, on_delete=models.CASCADE, related_name='contact_notes')
    note = models.TextField()
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Note for {self.contact} by {self.created_by}"
