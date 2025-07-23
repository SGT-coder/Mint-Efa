from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Workflow, WorkflowStep, WorkflowExecution
from .serializers import WorkflowSerializer, WorkflowStepSerializer, WorkflowExecutionSerializer

class WorkflowListCreateView(generics.ListCreateAPIView):
    queryset = Workflow.objects.all()
    serializer_class = WorkflowSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['is_active', 'trigger_event']
    search_fields = ['name', 'description']
    ordering_fields = ['created_at', 'name']
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class WorkflowDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Workflow.objects.all()
    serializer_class = WorkflowSerializer
    permission_classes = [IsAuthenticated]

class WorkflowStepListCreateView(generics.ListCreateAPIView):
    serializer_class = WorkflowStepSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        workflow_id = self.kwargs['workflow_id']
        return WorkflowStep.objects.filter(workflow_id=workflow_id)
    
    def perform_create(self, serializer):
        workflow_id = self.kwargs['workflow_id']
        serializer.save(workflow_id=workflow_id)

class WorkflowExecutionListView(generics.ListAPIView):
    serializer_class = WorkflowExecutionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        workflow_id = self.kwargs['workflow_id']
        return WorkflowExecution.objects.filter(workflow_id=workflow_id)
