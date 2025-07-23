from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/contacts/', include('contacts.urls')),
    path('api/cases/', include('cases.urls')),
    path('api/tasks/', include('tasks.urls')),
    path('api/documents/', include('documents.urls')),
    path('api/meetings/', include('meetings.urls')),
    path('api/emails/', include('emails.urls')),
    path('api/reports/', include('reports.urls')),
    path('api/workflows/', include('workflows.urls')),
    path('api/portal/', include('portal.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
