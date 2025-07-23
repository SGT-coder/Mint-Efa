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
    name = serializers.CharField(write_only=True, required=False)
    tags = serializers.ListField(child=serializers.CharField(), required=False)
    
    class Meta:
        model = Contact
        fields = [
            'id', 'type', 'first_name', 'last_name', 'company', 'title',
            'email', 'phone', 'mobile', 'address', 'city', 'state',
            'zip_code', 'country', 'status', 'notes', 'tags', 'assigned_to',
            'created_by', 'created_at', 'updated_at', 'contact_notes',
            'name'  # allow 'name' as input
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def to_internal_value(self, data):
        # If 'name' is provided, split into first_name and last_name
        name = data.get('name')
        if name:
            parts = name.strip().split()
            data['first_name'] = parts[0] if parts else ''
            data['last_name'] = ' '.join(parts[1:]) if len(parts) > 1 else ''
        # Convert tags array to comma-separated string
        tags = data.get('tags')
        if isinstance(tags, list):
            data['tags'] = ','.join(tags)
        # Remove extra fields not in Meta.fields
        data = {k: v for k, v in data.items() if k in self.Meta.fields}
        return super().to_internal_value(data)

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        # Convert tags string to array for frontend
        tags_str = rep.get('tags', '')
        rep['tags'] = [t.strip() for t in tags_str.split(',') if t.strip()]
        return rep
