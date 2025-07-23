from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Case, CaseNote, CaseDocument
from .serializers import CaseSerializer, CaseNoteSerializer, CaseDocumentSerializer

class CaseListCreateView(generics.ListCreateAPIView):
    queryset = Case.objects.all()
    serializer_class = CaseSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'priority', 'case_type', 'assigned_lawyer']
    search_fields = ['case_number', 'title', 'description']
    ordering_fields = ['created_at', 'case_number', 'title', 'priority']
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class CaseDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Case.objects.all()
    serializer_class = CaseSerializer
    permission_classes = [IsAuthenticated]

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_case_note(request, case_id):
    try:
        case = Case.objects.get(id=case_id)
        serializer = CaseNoteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(case=case, created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Case.DoesNotExist:
        return Response({'error': 'Case not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_case_document(request, case_id):
    try:
        case = Case.objects.get(id=case_id)
        serializer = CaseDocumentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(case=case, uploaded_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Case.DoesNotExist:
        return Response({'error': 'Case not found'}, status=status.HTTP_404_NOT_FOUND)
