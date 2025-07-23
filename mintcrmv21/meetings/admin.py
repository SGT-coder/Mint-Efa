from django.contrib import admin
from .models import Meeting, MeetingNote

class MeetingNoteInline(admin.TabularInline):
    model = MeetingNote
    extra = 0
    readonly_fields = ['created_at']

@admin.register(Meeting)
class MeetingAdmin(admin.ModelAdmin):
    list_display = ['title', 'meeting_type', 'status', 'start_time', 'organizer']
    list_filter = ['meeting_type', 'status', 'start_time']
    search_fields = ['title', 'description']
    inlines = [MeetingNoteInline]
    readonly_fields = ['created_at', 'updated_at']
    filter_horizontal = ['attendees', 'external_attendees']

@admin.register(MeetingNote)
class MeetingNoteAdmin(admin.ModelAdmin):
    list_display = ['meeting', 'created_by', 'created_at']
    list_filter = ['created_at']
    readonly_fields = ['created_at']
