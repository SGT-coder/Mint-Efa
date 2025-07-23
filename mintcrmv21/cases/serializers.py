from rest_framework import serializers
from .models import Case, CaseNote, CaseDocument
from accounts.serializers import UserSerializer
from contacts.serializers import ContactSerializer

class CaseNoteSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    
    class Meta:
        model = CaseNote
        fields = ['id', 'note', 'is_billable', 'hours_spent', 'created_by', 'created_at']
        read_only_fields = ['id', 'created_at']

class CaseDocumentSerializer(serializers.ModelSerializer):
    uploaded_by = UserSerializer(read_only=True)
    
    class Meta:
        model = CaseDocument
        fields = ['id', 'title', 'document', 'description', 'uploaded_by', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at']

class CaseSerializer(serializers.ModelSerializer):
    client = ContactSerializer(read_only=True)
    assigned_lawyer = UserSerializer(read_only=True)
    team_members = UserSerializer(many=True, read_only=True)
    created_by = UserSerializer(read_only=True)
    case_notes = CaseNoteSerializer(many=True, read_only=True)
    case_documents = CaseDocumentSerializer(many=True, read_only=True)
    
    class Meta:
        model = Case
        fields = [
            'id', 'case_number', 'title', 'description', 'case_type', 'status',
            'priority', 'client', 'assigned_lawyer', 'team_members', 'court',
            'judge', 'opposing_counsel', 'statute_of_limitations', 'created_by',
            'created_at', 'updated_at', 'case_notes', 'case_documents'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
