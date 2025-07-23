from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.core.mail import send_mail
from django.utils import timezone
from .models import Email, EmailAttachment
from .serializers import EmailSerializer, EmailAttachmentSerializer

class EmailListCreateView(generics.ListCreateAPIView):
    queryset = Email.objects.all()
    serializer_class = EmailSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'case', 'contact']
    search_fields = ['subject', 'body', 'from_email', 'to_emails']
    ordering_fields = ['created_at', 'sent_at']

class EmailDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Email.objects.all()
    serializer_class = EmailSerializer
    permission_classes = [IsAuthenticated]

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_email(request, email_id):
    try:
        email = Email.objects.get(id=email_id)
        if email.status != 'draft':
            return Response({'error': 'Email already sent'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Send email using Django's send_mail
        try:
            send_mail(
                subject=email.subject,
                message=email.body,
                from_email=email.from_email,
                recipient_list=email.to_emails.split(','),
                fail_silently=False,
            )
            email.status = 'sent'
            email.sent_by = request.user
            email.sent_at = timezone.now()
            email.save()
            
            return Response({'message': 'Email sent successfully'})
        except Exception as e:
            email.status = 'failed'
            email.save()
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
    except Email.DoesNotExist:
        return Response({'error': 'Email not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_email_attachment(request, email_id):
    try:
        email = Email.objects.get(id=email_id)
        serializer = EmailAttachmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(email=email)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Email.DoesNotExist:
        return Response({'error': 'Email not found'}, status=status.HTTP_404_NOT_FOUND)
