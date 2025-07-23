from rest_framework import serializers
from .models import Meeting, MeetingNote
from accounts.serializers import UserSerializer
from contacts.serializers import ContactSerializer
from cases.serializers import CaseSerializer

class MeetingNoteSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    
    class Meta:
        model = MeetingNote
        fields = ['id', 'note', 'created_by', 'created_at']
        read_only_fields = ['id', 'created_at']

class MeetingSerializer(serializers.ModelSerializer):
    organizer = UserSerializer(read_only=True)
    attendees = UserSerializer(many=True, read_only=True)
    external_attendees = ContactSerializer(many=True, read_only=True)
    case = CaseSerializer(read_only=True)
    meeting_notes = MeetingNoteSerializer(many=True, read_only=True)
    
    class Meta:
        model = Meeting
        fields = [
            'id', 'title', 'description', 'meeting_type', 'status', 'start_time',
            'end_time', 'location', 'meeting_url', 'case', 'organizer', 'attendees',
            'external_attendees', 'notes', 'created_at', 'updated_at', 'meeting_notes'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
