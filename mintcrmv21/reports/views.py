from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Count, Q
from cases.models import Case
from tasks.models import Task
from contacts.models import Contact
from .models import Report, ScheduledReport
from .serializers import ReportSerializer, ScheduledReportSerializer

class ReportListCreateView(generics.ListCreateAPIView):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['report_type']
    search_fields = ['name', 'description']
    ordering_fields = ['created_at', 'name']
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class ReportDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    permission_classes = [IsAuthenticated]

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    stats = {
        'total_cases': Case.objects.count(),
        'open_cases': Case.objects.filter(status='open').count(),
        'pending_tasks': Task.objects.filter(status='pending').count(),
        'total_contacts': Contact.objects.count(),
        'cases_by_status': list(
            Case.objects.values('status').annotate(count=Count('id'))
        ),
        'tasks_by_priority': list(
            Task.objects.values('priority').annotate(count=Count('id'))
        ),
        'recent_cases': Case.objects.order_by('-created_at')[:5].values(
            'id', 'case_number', 'title', 'status', 'created_at'
        ),
    }
    return Response(stats)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_report(request, report_id):
    try:
        report = Report.objects.get(id=report_id)
        
        # Generate report data based on report type
        if report.report_type == 'case_summary':
            data = {
                'total_cases': Case.objects.count(),
                'cases_by_status': list(
                    Case.objects.values('status').annotate(count=Count('id'))
                ),
                'cases_by_type': list(
                    Case.objects.values('case_type').annotate(count=Count('id'))
                ),
            }
        elif report.report_type == 'time_tracking':
            data = {
                'total_billable_hours': Task.objects.filter(
                    actual_hours__isnull=False
                ).aggregate(total=models.Sum('actual_hours'))['total'] or 0,
                'tasks_by_user': list(
                    Task.objects.values('assigned_to__username').annotate(
                        count=Count('id'),
                        total_hours=models.Sum('actual_hours')
                    )
                ),
            }
        else:
            data = {'message': 'Report type not implemented yet'}
        
        report.generated_data = data
        report.save()
        
        return Response({'data': data})
    except Report.DoesNotExist:
        return Response({'error': 'Report not found'}, status=status.HTTP_404_NOT_FOUND)
