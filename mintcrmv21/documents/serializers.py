from rest_framework import serializers
from .models import Document, DocumentVersion
from accounts.serializers import UserSerializer

class DocumentVersionSerializer(serializers.ModelSerializer):
    uploaded_by = UserSerializer(read_only=True)
    
    class Meta:
        model = DocumentVersion
        fields = ['id', 'version', 'file', 'changes', 'uploaded_by', 'created_at']
        read_only_fields = ['id', 'created_at']

class DocumentSerializer(serializers.ModelSerializer):
    uploaded_by = UserSerializer(read_only=True)
    versions = DocumentVersionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Document
        fields = [
            'id', 'title', 'description', 'document_type', 'file', 'case',
            'contact', 'tags', 'is_confidential', 'version', 'uploaded_by',
            'created_at', 'updated_at', 'versions'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
