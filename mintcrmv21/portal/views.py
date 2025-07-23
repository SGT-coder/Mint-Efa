from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import ClientPortalAccess, PortalRequest, PortalDocument
from .serializers import ClientPortalAccessSerializer, PortalRequestSerializer, PortalDocumentSerializer

class PortalRequestListCreateView(generics.ListCreateAPIView):
    queryset = PortalRequest.objects.all()
    serializer_class = PortalRequestSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['request_type', 'status', 'assigned_to']
    search_fields = ['subject', 'description']
    ordering_fields = ['created_at', 'updated_at']

class PortalRequestDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = PortalRequest.objects.all()
    serializer_class = PortalRequestSerializer
    permission_classes = [IsAuthenticated]

class PortalDocumentListCreateView(generics.ListCreateAPIView):
    queryset = PortalDocument.objects.all()
    serializer_class = PortalDocumentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['contact', 'is_public']
    search_fields = ['title', 'description']
    ordering_fields = ['uploaded_at', 'title']
    
    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)

class PortalDocumentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = PortalDocument.objects.all()
    serializer_class = PortalDocumentSerializer
    permission_classes = [IsAuthenticated]

@api_view(['POST'])
@permission_classes([AllowAny])
def submit_portal_request(request):
    """Public endpoint for clients to submit requests"""
    serializer = PortalRequestSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
