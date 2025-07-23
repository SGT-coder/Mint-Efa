from rest_framework import serializers
from .models import Task, TaskComment
from accounts.serializers import UserSerializer
from cases.serializers import CaseSerializer
from contacts.serializers import ContactSerializer
from cases.models import Case
from contacts.models import Contact
from accounts.models import User

class TaskCommentSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    
    class Meta:
        model = TaskComment
        fields = ['id', 'comment', 'created_by', 'created_at']
        read_only_fields = ['id', 'created_at']

class TaskSerializer(serializers.ModelSerializer):
    assigned_to = UserSerializer(read_only=True)
    case = CaseSerializer(read_only=True)
    contact = ContactSerializer(read_only=True)
    created_by = UserSerializer(read_only=True)
    comments = TaskCommentSerializer(many=True, read_only=True)
    assignee = serializers.CharField(write_only=True, required=False)
    caseId = serializers.CharField(write_only=True, required=False)
    estimatedHours = serializers.CharField(write_only=True, required=False)
    dueDate = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'status', 'priority', 'assigned_to',
            'case', 'contact', 'due_date', 'completed_at', 'estimated_hours',
            'actual_hours', 'created_by', 'created_at', 'updated_at', 'comments',
            'assignee', 'caseId', 'estimatedHours', 'dueDate'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def to_internal_value(self, data):
        # Map frontend aliases to backend fields
        if 'assignee' in data:
            data['assigned_to'] = data['assignee']
        if 'caseId' in data:
            data['case'] = data['caseId']
        if 'estimatedHours' in data:
            data['estimated_hours'] = data['estimatedHours']
        if 'dueDate' in data:
            data['due_date'] = data['dueDate']
        # Remove extra fields not in Meta.fields or mapped
        allowed = set(self.Meta.fields)
        # Add backend field names for mapped fields
        allowed.update(['assigned_to', 'case', 'estimated_hours', 'due_date'])
        data = {k: v for k, v in data.items() if k in allowed}
        return super().to_internal_value(data)
