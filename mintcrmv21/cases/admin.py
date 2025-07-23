from django.contrib import admin
from .models import Case, CaseNote, CaseDocument

class CaseNoteInline(admin.TabularInline):
    model = CaseNote
    extra = 0
    readonly_fields = ['created_at']

class CaseDocumentInline(admin.TabularInline):
    model = CaseDocument
    extra = 0
    readonly_fields = ['uploaded_at']

@admin.register(Case)
class CaseAdmin(admin.ModelAdmin):
    list_display = ['case_number', 'title', 'status', 'priority', 'assigned_lawyer', 'created_at']
    list_filter = ['status', 'priority', 'case_type', 'created_at']
    search_fields = ['case_number', 'title', 'description']
    inlines = [CaseNoteInline, CaseDocumentInline]
    readonly_fields = ['created_at', 'updated_at']
    filter_horizontal = ['team_members']

@admin.register(CaseNote)
class CaseNoteAdmin(admin.ModelAdmin):
    list_display = ['case', 'created_by', 'is_billable', 'hours_spent', 'created_at']
    list_filter = ['is_billable', 'created_at']
    readonly_fields = ['created_at']

@admin.register(CaseDocument)
class CaseDocumentAdmin(admin.ModelAdmin):
    list_display = ['title', 'case', 'uploaded_by', 'uploaded_at']
    list_filter = ['uploaded_at']
    readonly_fields = ['uploaded_at']
