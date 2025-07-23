from rest_framework import serializers
from .models import Contact, ContactNote
from accounts.serializers import UserSerializer

class ContactNoteSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    
    class Meta:
        model = ContactNote
        fields = ['id', 'note', 'created_by', 'created_at']
        read_only_fields = ['id', 'created_at']

class ContactSerializer(serializers.ModelSerializer):
    assigned_to = UserSerializer(read_only=True)
    created_by = UserSerializer(read_only=True)
    contact_notes = ContactNoteSerializer(many=True, read_only=True)
    
    class Meta:
        model = Contact
        fields = [
            'id', 'type', 'first_name', 'last_name', 'company', 'title',
            'email', 'phone', 'mobile', 'address', 'city', 'state',
            'zip_code', 'country', 'status', 'notes', 'assigned_to',
            'created_by', 'created_at', 'updated_at', 'contact_notes'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
