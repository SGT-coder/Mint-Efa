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
    requestType = serializers.CharField(write_only=True, required=False)
    message = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = PortalRequest
        fields = [
            'id', 'contact', 'request_type', 'subject', 'description',
            'status', 'assigned_to', 'response', 'created_at', 'updated_at',
            'requestType', 'message'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def to_internal_value(self, data):
        # Map frontend aliases to backend fields
        if 'requestType' in data:
            data['request_type'] = data['requestType']
        if 'message' in data:
            data['description'] = data['message']
        # Remove extra fields not in Meta.fields or mapped
        allowed = set(self.Meta.fields)
        allowed.add('request_type')
        allowed.add('description')
        data = {k: v for k, v in data.items() if k in allowed}
        return super().to_internal_value(data)
