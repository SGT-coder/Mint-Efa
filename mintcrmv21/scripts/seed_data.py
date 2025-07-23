#!/usr/bin/env python
"""
Script to seed the database with sample data for development
Run with: python manage.py shell < scripts/seed_data.py
"""

import os
import sys
import django
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import datetime, timedelta

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mintcrm.settings')
django.setup()

from accounts.models import User, UserProfile
from contacts.models import Contact, ContactNote
from cases.models import Case, CaseNote
from tasks.models import Task, TaskComment
from meetings.models import Meeting

User = get_user_model()

def create_users():
    """Create sample users"""
    print("Creating users...")
    
    # Create admin user
    admin, created = User.objects.get_or_create(
        username='admin',
        defaults={
            'email': 'admin@mintcrm.com',
            'first_name': 'Admin',
            'last_name': 'User',
            'role': 'admin',
            'is_staff': True,
            'is_superuser': True,
        }
    )
    if created:
        admin.set_password('admin123')
        admin.save()
        UserProfile.objects.create(user=admin)
    
    # Create lawyer
    lawyer, created = User.objects.get_or_create(
        username='lawyer1',
        defaults={
            'email': 'lawyer@mintcrm.com',
            'first_name': 'John',
            'last_name': 'Lawyer',
            'role': 'lawyer',
            'department': 'Litigation',
        }
    )
    if created:
        lawyer.set_password('lawyer123')
        lawyer.save()
        UserProfile.objects.create(user=lawyer)
    
    # Create paralegal
    paralegal, created = User.objects.get_or_create(
        username='paralegal1',
        defaults={
            'email': 'paralegal@mintcrm.com',
            'first_name': 'Jane',
            'last_name': 'Paralegal',
            'role': 'paralegal',
            'department': 'Support',
        }
    )
    if created:
        paralegal.set_password('paralegal123')
        paralegal.save()
        UserProfile.objects.create(user=paralegal)
    
    return admin, lawyer, paralegal

def create_contacts():
    """Create sample contacts"""
    print("Creating contacts...")
    
    contacts = [
        {
            'first_name': 'Alice',
            'last_name': 'Johnson',
            'email': 'alice.johnson@email.com',
            'phone': '555-0101',
            'company': 'Johnson Enterprises',
            'type': 'individual',
            'status': 'active',
        },
        {
            'first_name': 'Bob',
            'last_name': 'Smith',
            'email': 'bob.smith@email.com',
            'phone': '555-0102',
            'company': 'Smith Corp',
            'type': 'individual',
            'status': 'active',
        },
        {
            'company': 'Tech Solutions Inc',
            'first_name': 'Tech',
            'last_name': 'Solutions',
            'email': 'contact@techsolutions.com',
            'phone': '555-0103',
            'type': 'organization',
            'status': 'prospect',
        }
    ]
    
    created_contacts = []
    admin = User.objects.get(username='admin')
    
    for contact_data in contacts:
        contact, created = Contact.objects.get_or_create(
            email=contact_data['email'],
            defaults={**contact_data, 'created_by': admin}
        )
        created_contacts.append(contact)
    
    return created_contacts

def create_cases(contacts):
    """Create sample cases"""
    print("Creating cases...")
    
    lawyer = User.objects.get(username='lawyer1')
    admin = User.objects.get(username='admin')
    
    cases_data = [
        {
            'case_number': 'CASE-2024-001',
            'title': 'Contract Dispute - Johnson vs Smith',
            'description': 'Contract dispute regarding service agreement',
            'case_type': 'litigation',
            'status': 'open',
            'priority': 'high',
            'client': contacts[0],
            'assigned_lawyer': lawyer,
        },
        {
            'case_number': 'CASE-2024-002',
            'title': 'Corporate Formation - Tech Solutions',
            'description': 'Assistance with corporate formation and compliance',
            'case_type': 'corporate',
            'status': 'in_progress',
            'priority': 'medium',
            'client': contacts[2],
            'assigned_lawyer': lawyer,
        }
    ]
    
    created_cases = []
    for case_data in cases_data:
        case, created = Case.objects.get_or_create(
            case_number=case_data['case_number'],
            defaults={**case_data, 'created_by': admin}
        )
        created_cases.append(case)
    
    return created_cases

def create_tasks(cases):
    """Create sample tasks"""
    print("Creating tasks...")
    
    lawyer = User.objects.get(username='lawyer1')
    paralegal = User.objects.get(username='paralegal1')
    admin = User.objects.get(username='admin')
    
    tasks_data = [
        {
            'title': 'Review contract documents',
            'description': 'Review all contract documents for Case-2024-001',
            'status': 'pending',
            'priority': 'high',
            'assigned_to': lawyer,
            'case': cases[0],
            'due_date': timezone.now() + timedelta(days=3),
            'estimated_hours': 4.0,
        },
        {
            'title': 'Prepare filing documents',
            'description': 'Prepare necessary filing documents for court',
            'status': 'in_progress',
            'priority': 'medium',
            'assigned_to': paralegal,
            'case': cases[0],
            'due_date': timezone.now() + timedelta(days=7),
            'estimated_hours': 6.0,
        },
        {
            'title': 'Client consultation follow-up',
            'description': 'Follow up with client regarding case status',
            'status': 'completed',
            'priority': 'low',
            'assigned_to': lawyer,
            'case': cases[1],
            'due_date': timezone.now() - timedelta(days=1),
            'estimated_hours': 1.0,
            'actual_hours': 1.5,
            'completed_at': timezone.now() - timedelta(hours=2),
        }
    ]
    
    created_tasks = []
    for task_data in tasks_data:
        task, created = Task.objects.get_or_create(
            title=task_data['title'],
            defaults={**task_data, 'created_by': admin}
        )
        created_tasks.append(task)
    
    return created_tasks

def create_meetings(cases):
    """Create sample meetings"""
    print("Creating meetings...")
    
    lawyer = User.objects.get(username='lawyer1')
    paralegal = User.objects.get(username='paralegal1')
    
    meetings_data = [
        {
            'title': 'Client Consultation - Johnson Case',
            'description': 'Initial consultation with Alice Johnson',
            'meeting_type': 'consultation',
            'status': 'scheduled',
            'start_time': timezone.now() + timedelta(days=2, hours=10),
            'end_time': timezone.now() + timedelta(days=2, hours=11),
            'location': 'Conference Room A',
            'case': cases[0],
            'organizer': lawyer,
        },
        {
            'title': 'Team Meeting - Case Review',
            'description': 'Weekly team meeting to review active cases',
            'meeting_type': 'team_meeting',
            'status': 'scheduled',
            'start_time': timezone.now() + timedelta(days=1, hours=14),
            'end_time': timezone.now() + timedelta(days=1, hours=15),
            'location': 'Conference Room B',
            'organizer': lawyer,
        }
    ]
    
    created_meetings = []
    for meeting_data in meetings_data:
        meeting, created = Meeting.objects.get_or_create(
            title=meeting_data['title'],
            defaults=meeting_data
        )
        if created:
            meeting.attendees.add(lawyer, paralegal)
        created_meetings.append(meeting)
    
    return created_meetings

def main():
    """Main function to seed all data"""
    print("Starting database seeding...")
    
    try:
        # Create users
        admin, lawyer, paralegal = create_users()
        
        # Create contacts
        contacts = create_contacts()
        
        # Create cases
        cases = create_cases(contacts)
        
        # Create tasks
        tasks = create_tasks(cases)
        
        # Create meetings
        meetings = create_meetings(cases)
        
        print("Database seeding completed successfully!")
        print(f"Created {User.objects.count()} users")
        print(f"Created {Contact.objects.count()} contacts")
        print(f"Created {Case.objects.count()} cases")
        print(f"Created {Task.objects.count()} tasks")
        print(f"Created {Meeting.objects.count()} meetings")
        
    except Exception as e:
        print(f"Error during seeding: {str(e)}")
        sys.exit(1)

if __name__ == '__main__':
    main()
