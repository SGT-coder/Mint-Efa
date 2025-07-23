from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Meeting, MeetingNote
from .serializers import MeetingSerializer, MeetingNoteSerializer

class MeetingListCreateView(generics.ListCreateAPIView):
    queryset = Meeting.objects.all()
    serializer_class = MeetingSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['meeting_type', 'status', 'organizer', 'case']
    search_fields = ['title', 'description']
    ordering_fields = ['start_time', 'created_at']
    
    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)

class MeetingDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Meeting.objects.all()
    serializer_class = MeetingSerializer
    permission_classes = [IsAuthenticated]

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_meeting_note(request, meeting_id):
    try:
        meeting = Meeting.objects.get(id=meeting_id)
        serializer = MeetingNoteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(meeting=meeting, created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Meeting.DoesNotExist:
        return Response({'error': 'Meeting not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_meetings(request):
    meetings = Meeting.objects.filter(attendees=request.user)
    serializer = MeetingSerializer(meetings, many=True)
    return Response(serializer.data)
