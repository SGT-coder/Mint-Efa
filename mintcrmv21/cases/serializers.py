from rest_framework import serializers
from .models import Case, CaseNote, CaseDocument
from accounts.serializers import UserSerializer
from contacts.serializers import ContactSerializer
import uuid
from contacts.models import Contact
from accounts.models import User

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
    contact_email = serializers.EmailField(write_only=True, required=False)
    assignee = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = Case
        fields = [
            'id', 'case_number', 'title', 'description', 'case_type', 'status',
            'priority', 'client', 'assigned_lawyer', 'team_members', 'court',
            'judge', 'opposing_counsel', 'statute_of_limitations', 'created_by',
            'created_at', 'updated_at', 'case_notes', 'case_documents',
            'contact_email', 'assignee'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def to_internal_value(self, data):
        # Auto-generate case_number if not provided
        if not data.get('case_number'):
            data['case_number'] = str(uuid.uuid4())[:12]
        # Remove extra fields not in Meta.fields
        data = {k: v for k, v in data.items() if k in self.Meta.fields}
        return super().to_internal_value(data)

    def create(self, validated_data):
        contact_email = validated_data.pop('contact_email', None)
        assignee = validated_data.pop('assignee', None)
        # Set client by contact_email if provided
        if contact_email:
            try:
                contact = Contact.objects.get(email=contact_email)
                validated_data['client'] = contact
            except Contact.DoesNotExist:
                raise serializers.ValidationError({'contact_email': 'Contact with this email does not exist.'})
        # Set assigned_lawyer by assignee if provided
        if assignee:
            try:
                user = User.objects.get(id=assignee)
                validated_data['assigned_lawyer'] = user
            except User.DoesNotExist:
                raise serializers.ValidationError({'assignee': 'User with this ID does not exist.'})
        return super().create(validated_data)
