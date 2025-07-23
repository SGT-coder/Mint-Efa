from rest_framework import serializers
from .models import Meeting, MeetingNote
from accounts.serializers import UserSerializer
from contacts.serializers import ContactSerializer
from cases.serializers import CaseSerializer
import datetime

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
    type = serializers.CharField(write_only=True, required=False)
    meetingLink = serializers.CharField(write_only=True, required=False)
    date = serializers.CharField(write_only=True, required=False)
    time = serializers.CharField(write_only=True, required=False)
    duration = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = Meeting
        fields = [
            'id', 'title', 'description', 'meeting_type', 'status', 'start_time',
            'end_time', 'location', 'meeting_url', 'case', 'organizer', 'attendees',
            'external_attendees', 'notes', 'created_at', 'updated_at', 'meeting_notes',
            'type', 'meetingLink', 'date', 'time', 'duration'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def to_internal_value(self, data):
        # Map frontend aliases to backend fields
        if 'type' in data:
            data['meeting_type'] = data['type']
        if 'meetingLink' in data:
            data['meeting_url'] = data['meetingLink']
        # Combine date, time, and duration into start_time and end_time
        if 'date' in data and 'time' in data:
            try:
                start_str = f"{data['date']}T{data['time']}"
                data['start_time'] = datetime.datetime.fromisoformat(start_str)
            except Exception:
                pass
        if 'start_time' in data and 'duration' in data:
            try:
                duration_minutes = int(data['duration'])
                data['end_time'] = data['start_time'] + datetime.timedelta(minutes=duration_minutes)
            except Exception:
                pass
        # Remove extra fields not in Meta.fields or mapped
        allowed = set(self.Meta.fields)
        allowed.update(['meeting_type', 'meeting_url', 'start_time', 'end_time'])
        data = {k: v for k, v in data.items() if k in allowed}
        return super().to_internal_value(data)
