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
    
    class Meta:
        model = Email
        fields = [
            'id', 'subject', 'body', 'from_email', 'to_emails', 'cc_emails',
            'bcc_emails', 'status', 'case', 'contact', 'sent_by', 'sent_at',
            'created_at', 'updated_at', 'attachments'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
