from django.db import models
from django.conf import settings
from contacts.models import Contact

class Case(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('pending', 'Pending'),
        ('closed', 'Closed'),
        ('archived', 'Archived'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    CASE_TYPE_CHOICES = [
        ('litigation', 'Litigation'),
        ('corporate', 'Corporate'),
        ('family', 'Family Law'),
        ('criminal', 'Criminal'),
        ('immigration', 'Immigration'),
        ('real_estate', 'Real Estate'),
        ('personal_injury', 'Personal Injury'),
        ('other', 'Other'),
    ]
    
    case_number = models.CharField(max_length=50, unique=True)
    title = models.CharField(max_length=200)
    description = models.TextField()
    case_type = models.CharField(max_length=50, choices=CASE_TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    client = models.ForeignKey(Contact, on_delete=models.CASCADE, related_name='cases')
    assigned_lawyer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='assigned_cases')
    team_members = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True, related_name='team_cases')
    court = models.CharField(max_length=200, blank=True)
    judge = models.CharField(max_length=100, blank=True)
    opposing_counsel = models.CharField(max_length=200, blank=True)
    statute_of_limitations = models.DateField(null=True, blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_cases')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.case_number} - {self.title}"

class CaseNote(models.Model):
    case = models.ForeignKey(Case, on_delete=models.CASCADE, related_name='case_notes')
    note = models.TextField()
    is_billable = models.BooleanField(default=False)
    hours_spent = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Note for {self.case} by {self.created_by}"

class CaseDocument(models.Model):
    case = models.ForeignKey(Case, on_delete=models.CASCADE, related_name='case_documents')
    title = models.CharField(max_length=200)
    document = models.FileField(upload_to='case_documents/')
    description = models.TextField(blank=True)
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.title} - {self.case}"
