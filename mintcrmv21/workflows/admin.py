from django.contrib import admin
from .models import Workflow, WorkflowStep, WorkflowExecution

class WorkflowStepInline(admin.TabularInline):
    model = WorkflowStep
    extra = 0

@admin.register(Workflow)
class WorkflowAdmin(admin.ModelAdmin):
    list_display = ['name', 'is_active', 'trigger_event', 'created_by', 'created_at']
    list_filter = ['is_active', 'trigger_event', 'created_at']
    search_fields = ['name', 'description']
    inlines = [WorkflowStepInline]
    readonly_fields = ['created_at', 'updated_at']

@admin.register(WorkflowStep)
class WorkflowStepAdmin(admin.ModelAdmin):
    list_display = ['workflow', 'name', 'step_type', 'order', 'is_active']
    list_filter = ['step_type', 'is_active']

@admin.register(WorkflowExecution)
class WorkflowExecutionAdmin(admin.ModelAdmin):
    list_display = ['workflow', 'status', 'started_at', 'completed_at']
    list_filter = ['status', 'started_at']
    readonly_fields = ['started_at', 'completed_at']
