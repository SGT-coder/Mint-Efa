from django.contrib import admin
from .models import Report, ScheduledReport

class ScheduledReportInline(admin.TabularInline):
    model = ScheduledReport
    extra = 0

@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ['name', 'report_type', 'created_by', 'created_at']
    list_filter = ['report_type', 'created_at']
    search_fields = ['name', 'description']
    inlines = [ScheduledReportInline]
    readonly_fields = ['created_at', 'updated_at']

@admin.register(ScheduledReport)
class ScheduledReportAdmin(admin.ModelAdmin):
    list_display = ['report', 'frequency', 'is_active', 'last_sent', 'next_send']
    list_filter = ['frequency', 'is_active']
