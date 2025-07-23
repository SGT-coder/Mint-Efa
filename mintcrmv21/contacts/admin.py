from django.contrib import admin
from .models import Contact, ContactNote

class ContactNoteInline(admin.TabularInline):
    model = ContactNote
    extra = 0
    readonly_fields = ['created_at']

@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ['first_name', 'last_name', 'company', 'email', 'status', 'assigned_to', 'created_at']
    list_filter = ['type', 'status', 'created_at']
    search_fields = ['first_name', 'last_name', 'company', 'email']
    inlines = [ContactNoteInline]
    readonly_fields = ['created_at', 'updated_at']

@admin.register(ContactNote)
class ContactNoteAdmin(admin.ModelAdmin):
    list_display = ['contact', 'created_by', 'created_at']
    list_filter = ['created_at']
    readonly_fields = ['created_at']
