from rest_framework import serializers
from .models import Report, ScheduledReport
from accounts.serializers import UserSerializer

class ScheduledReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScheduledReport
        fields = ['id', 'frequency', 'recipients', 'is_active', 'last_sent', 'next_send', 'created_at']
        read_only_fields = ['id', 'created_at']

class ReportSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    scheduled_reports = ScheduledReportSerializer(many=True, read_only=True)
    
    class Meta:
        model = Report
        fields = [
            'id', 'name', 'description', 'report_type', 'parameters',
            'generated_data', 'created_by', 'created_at', 'updated_at',
            'scheduled_reports'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
