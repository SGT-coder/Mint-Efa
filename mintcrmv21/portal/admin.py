from django.contrib import admin
from .models import ClientPortalAccess, PortalRequest, PortalDocument

@admin.register(ClientPortalAccess)
class ClientPortalAccessAdmin(admin.ModelAdmin):
    list_display = ['contact', 'username', 'is_active', 'last_login', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['username', 'contact__first_name', 'contact__last_name']

@admin.register(PortalRequest)
class PortalRequestAdmin(admin.ModelAdmin):
    list_display = ['subject', 'contact', 'request_type', 'status', 'assigned_to', 'created_at']
    list_filter = ['request_type', 'status', 'created_at']
    search_fields = ['subject', 'description']

@admin.register(PortalDocument)
class PortalDocumentAdmin(admin.ModelAdmin):
    list_display = ['title', 'contact', 'is_public', 'uploaded_by', 'uploaded_at']
    list_filter = ['is_public', 'uploaded_at']
    search_fields = ['title', 'description']
