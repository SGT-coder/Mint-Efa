from rest_framework import serializers
from .models import Task, TaskComment
from accounts.serializers import UserSerializer
from cases.serializers import CaseSerializer
from contacts.serializers import ContactSerializer

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
    
    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'status', 'priority', 'assigned_to',
            'case', 'contact', 'due_date', 'completed_at', 'estimated_hours',
            'actual_hours', 'created_by', 'created_at', 'updated_at', 'comments'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
