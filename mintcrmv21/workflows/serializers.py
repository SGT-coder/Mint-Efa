from rest_framework import serializers
from .models import Workflow, WorkflowStep, WorkflowExecution
from accounts.serializers import UserSerializer

class WorkflowStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkflowStep
        fields = ['id', 'name', 'step_type', 'order', 'parameters', 'is_active']
        read_only_fields = ['id']

class WorkflowExecutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkflowExecution
        fields = ['id', 'status', 'trigger_data', 'result_data', 'started_at', 'completed_at']
        read_only_fields = ['id', 'started_at', 'completed_at']

class WorkflowSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    steps = WorkflowStepSerializer(many=True, read_only=True)
    executions = WorkflowExecutionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Workflow
        fields = [
            'id', 'name', 'description', 'is_active', 'trigger_event',
            'created_by', 'created_at', 'updated_at', 'steps', 'executions'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
