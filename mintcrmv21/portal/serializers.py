from rest_framework import serializers
from .models import ClientPortalAccess, PortalRequest, PortalDocument
from contacts.serializers import ContactSerializer
from accounts.serializers import UserSerializer

class ClientPortalAccessSerializer(serializers.ModelSerializer):
    contact = ContactSerializer(read_only=True)
    
    class Meta:
        model = ClientPortalAccess
        fields = ['id', 'contact', 'username', 'is_active', 'last_login', 'created_at']
        read_only_fields = ['id', 'created_at']

class PortalDocumentSerializer(serializers.ModelSerializer):
    uploaded_by = UserSerializer(read_only=True)
    
    class Meta:
        model = PortalDocument
        fields = ['id', 'title', 'description', 'document', 'is_public', 'uploaded_by', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at']

class PortalRequestSerializer(serializers.ModelSerializer):
    contact = ContactSerializer(read_only=True)
    assigned_to = UserSerializer(read_only=True)
    
    class Meta:
        model = PortalRequest
        fields = [
            'id', 'contact', 'request_type', 'subject', 'description',
            'status', 'assigned_to', 'response', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
