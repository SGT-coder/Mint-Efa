from django.contrib import admin
from .models import Document, DocumentVersion

class DocumentVersionInline(admin.TabularInline):
    model = DocumentVersion
    extra = 0
    readonly_fields = ['created_at']

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ['title', 'document_type', 'case', 'uploaded_by', 'created_at']
    list_filter = ['document_type', 'is_confidential', 'created_at']
    search_fields = ['title', 'description', 'tags']
    inlines = [DocumentVersionInline]
    readonly_fields = ['created_at', 'updated_at']

@admin.register(DocumentVersion)
class DocumentVersionAdmin(admin.ModelAdmin):
    list_display = ['document', 'version', 'uploaded_by', 'created_at']
    list_filter = ['created_at']
    readonly_fields = ['created_at']
