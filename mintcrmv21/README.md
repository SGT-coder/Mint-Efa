# MintCRM Django Backend

A comprehensive Django REST API backend for the MintCRM legal case management system.

## Features

- **User Management**: Role-based authentication (Admin, Lawyer, Paralegal, Staff, Client)
- **Contact Management**: Comprehensive contact and client management
- **Case Management**: Full case lifecycle management with notes and documents
- **Task Management**: Task assignment and tracking with comments
- **Document Management**: File upload and version control
- **Meeting Management**: Calendar and meeting scheduling
- **Email Integration**: Email management and sending
- **Reports**: Dashboard statistics and custom reports
- **Workflows**: Automated workflow management
- **Client Portal**: Self-service portal for clients

## Technology Stack

- **Framework**: Django 4.2 + Django REST Framework
- **Database**: PostgreSQL
- **Cache/Queue**: Redis + Celery
- **Authentication**: Token-based authentication
- **File Storage**: Local file system (configurable for cloud storage)

## Quick Start

### Using Docker (Recommended)

1. Clone the repository
2. Copy environment file:
   \`\`\`bash
   cp .env.example .env
   \`\`\`
3. Start the services:
   \`\`\`bash
   make docker-up
   \`\`\`
4. Run migrations:
   \`\`\`bash
   docker-compose exec web python manage.py migrate
   \`\`\`
5. Seed sample data:
   \`\`\`bash
   docker-compose exec web python manage.py shell < scripts/seed_data.py
   \`\`\`

### Manual Setup

1. Install dependencies:
   \`\`\`bash
   make install
   \`\`\`

2. Set up PostgreSQL database and update `.env` file

3. Run migrations:
   \`\`\`bash
   make migrate
   \`\`\`

4. Seed sample data:
   \`\`\`bash
   make seed
   \`\`\`

5. Start development server:
   \`\`\`bash
   make run
   \`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/login/` - User login
- `POST /api/auth/register/` - User registration
- `POST /api/auth/logout/` - User logout
- `GET /api/auth/profile/` - Get user profile

### Contacts
- `GET /api/contacts/` - List contacts
- `POST /api/contacts/` - Create contact
- `GET /api/contacts/{id}/` - Get contact details
- `PUT /api/contacts/{id}/` - Update contact
- `DELETE /api/contacts/{id}/` - Delete contact

### Cases
- `GET /api/cases/` - List cases
- `POST /api/cases/` - Create case
- `GET /api/cases/{id}/` - Get case details
- `PUT /api/cases/{id}/` - Update case
- `DELETE /api/cases/{id}/` - Delete case

### Tasks
- `GET /api/tasks/` - List tasks
- `POST /api/tasks/` - Create task
- `GET /api/tasks/my-tasks/` - Get current user's tasks
- `GET /api/tasks/{id}/` - Get task details

### Documents
- `GET /api/documents/` - List documents
- `POST /api/documents/` - Upload document
- `GET /api/documents/{id}/` - Get document details

### Meetings
- `GET /api/meetings/` - List meetings
- `POST /api/meetings/` - Create meeting
- `GET /api/meetings/my-meetings/` - Get current user's meetings

### Reports
- `GET /api/reports/dashboard-stats/` - Get dashboard statistics
- `GET /api/reports/` - List reports
- `POST /api/reports/{id}/generate/` - Generate report

## Sample Users

After seeding the database, you can use these credentials:

- **Admin**: username: `admin`, password: `admin123`
- **Lawyer**: username: `lawyer1`, password: `lawyer123`
- **Paralegal**: username: `paralegal1`, password: `paralegal123`

## Development

### Running Tests
\`\`\`bash
make test
\`\`\`

### Code Structure
\`\`\`
mintcrm/
├── accounts/          # User management
├── contacts/          # Contact management
├── cases/            # Case management
├── tasks/            # Task management
├── documents/        # Document management
├── meetings/         # Meeting management
├── emails/           # Email management
├── reports/          # Reporting system
├── workflows/        # Workflow automation
├── portal/           # Client portal
└── scripts/          # Database scripts
\`\`\`

### Adding New Features

1. Create a new Django app: `python manage.py startapp newapp`
2. Add models in `models.py`
3. Create serializers in `serializers.py`
4. Add views in `views.py`
5. Configure URLs in `urls.py`
6. Register in admin (optional)
7. Add to `INSTALLED_APPS` in settings

## Deployment

### Production Settings

1. Set `DEBUG=False` in environment
2. Configure proper database credentials
3. Set up static file serving
4. Configure email settings
5. Set up SSL/HTTPS
6. Configure allowed hosts

### Environment Variables

See `.env.example` for all required environment variables.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.
