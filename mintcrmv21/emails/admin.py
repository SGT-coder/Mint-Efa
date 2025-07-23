from django.contrib import admin
from .models import Email, EmailAttachment

class EmailAttachmentInline(admin.TabularInline):
    model = EmailAttachment
    extra = 0

@admin.register(Email)
class EmailAdmin(admin.ModelAdmin):
    list_display = ['subject', 'from_email', 'status', 'sent_at', 'created_at']
    list_filter = ['status', 'sent_at', 'created_at']
    search_fields = ['subject', 'body', 'from_email', 'to_emails']
    inlines = [EmailAttachmentInline]
    readonly_fields = ['created_at', 'updated_at']

@admin.register(EmailAttachment)
class EmailAttachmentAdmin(admin.ModelAdmin):
    list_display = ['filename', 'email', 'file']
