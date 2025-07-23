from rest_framework import serializers
from .models import Email, EmailAttachment
from accounts.serializers import UserSerializer

class EmailAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailAttachment
        fields = ['id', 'file', 'filename']
        read_only_fields = ['id']

class EmailSerializer(serializers.ModelSerializer):
    sent_by = UserSerializer(read_only=True)
    attachments = EmailAttachmentSerializer(many=True, read_only=True)
    to = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = Email
        fields = [
            'id', 'subject', 'body', 'from_email', 'to_emails', 'cc_emails',
            'bcc_emails', 'status', 'case', 'contact', 'sent_by', 'sent_at',
            'created_at', 'updated_at', 'attachments', 'to'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def to_internal_value(self, data):
        # Map frontend alias to backend field
        if 'to' in data:
            data['to_emails'] = data['to']
        # Remove extra fields not in Meta.fields or mapped
        allowed = set(self.Meta.fields)
        allowed.add('to_emails')
        data = {k: v for k, v in data.items() if k in allowed}
        return super().to_internal_value(data)
