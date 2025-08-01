# TaskManager - Full Stack Task Management Application

A modern task management application built with Django REST API and React frontend.

## 🚀 Features

- **User Authentication**: JWT-based authentication system
- **Task Management**: Create, update, delete, and organize tasks
- **Project Management**: Group tasks by projects
- **Kanban Board**: Visual task organization with drag-and-drop
- **Dashboard**: Comprehensive overview with metrics and analytics
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: Live task status updates

## 🛠️ Tech Stack

### Backend
- **Django 5.2.4**: Web framework
- **Django REST Framework**: API development
- **SQLite/PostgreSQL**: Database
- **JWT Authentication**: Secure authentication
- **CORS**: Cross-origin resource sharing

### Frontend
- **React 19.1.1**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Styling
- **Radix UI**: Accessible components
- **Framer Motion**: Animations
- **React Router**: Navigation
- **React Hook Form**: Form handling

## 📋 Prerequisites

- **Python 3.8+**
- **Node.js 18+**
- **npm** or **yarn**
- **Redis** (optional, for caching)
- **PostgreSQL** (optional, for production)

### Development Tools

For optimal development experience, install these VS Code extensions:

```bash
code --install-extension ms-python.python
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss
code --install-extension dsznajder.es7-react-js-snippets
```

### System Requirements

- Minimum 4GB RAM
- 2GB free disk space
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for package installation

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd taskmanager-main
```

### 2. Set Up Environment Variables
```bash
# Copy the example environment file
copy env.example .env

# Edit .env with your configuration
# At minimum, set a secure DJANGO_SECRET_KEY
```

### 3. Install Dependencies

#### Backend (Django)
```bash
pip install -r requirements.txt
```

#### Frontend (React)
```bash
cd frontend
npm install
cd ..
```

### 4. Run Database Migrations
```bash
python manage.py migrate
```

### 5. Create Superuser (Optional)
```bash
python manage.py createsuperuser
```

### 6. Start Development Servers

#### Option A: Using PowerShell Script (Windows)
```powershell
.\run_dev.ps1
```

#### Option B: Manual Start
```bash
# Terminal 1: Start Django server
python manage.py runserver

# Terminal 2: Start React development server
cd frontend
npm run dev
```

### 7. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Django Settings
DJANGO_SECRET_KEY=your-secret-key-here
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1

# Database Settings
DATABASE_URL=sqlite:///db.sqlite3
DB_CONN_MAX_AGE=600  # Database connection lifetime in seconds

# CORS Settings
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
CORS_ALLOW_CREDENTIALS=True

# JWT Settings
JWT_SECRET_KEY=your-jwt-secret-key
JWT_ACCESS_TOKEN_LIFETIME=5
JWT_REFRESH_TOKEN_LIFETIME=1
JWT_ROTATE_REFRESH_TOKENS=True

# Cache Settings
REDIS_URL=redis://localhost:6379/1
CACHE_TIMEOUT=300  # Cache timeout in seconds

# Email Settings (Optional)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-specific-password

# Security Settings
SECURE_SSL_REDIRECT=False  # Set to True in production
SESSION_COOKIE_SECURE=False  # Set to True in production
CSRF_COOKIE_SECURE=False  # Set to True in production
SECURE_BROWSER_XSS_FILTER=True
SECURE_CONTENT_TYPE_NOSNIFF=True

# API Rate Limiting
API_RATE_LIMIT_ANON=100/day
API_RATE_LIMIT_USER=1000/day
```

### Production Deployment

1. **Pre-deployment Checklist**:
   ```bash
   # Security check
   python manage.py check --deploy
   
   # Test production settings
   python manage.py test --settings=config.settings_prod
   
   # Check for missing migrations
   python manage.py makemigrations --check
   ```

2. **Set Production Environment Variables**:
   ```env
   # Essential settings
   DJANGO_DEBUG=False
   DJANGO_SECRET_KEY=your-production-secret-key
   DJANGO_ALLOWED_HOSTS=your-domain.com,www.your-domain.com
   DATABASE_URL=postgresql://user:password@localhost/dbname

   # Security settings
   SECURE_SSL_REDIRECT=True
   SESSION_COOKIE_SECURE=True
   CSRF_COOKIE_SECURE=True
   SECURE_HSTS_SECONDS=31536000
   SECURE_HSTS_INCLUDE_SUBDOMAINS=True

   # Performance settings
   CONN_MAX_AGE=60
   CACHE_URL=redis://redis:6379/1
   ```

3. **Database Setup**:
   ```bash
   # Create production database
   createdb taskmanager_prod
   
   # Apply migrations
   python manage.py migrate --settings=config.settings_prod
   
   # Create admin user
   python manage.py createsuperuser --settings=config.settings_prod
   ```

4. **Build and Collect Static Files**:
   ```bash
   # Build frontend
   cd frontend
   npm run build
   
   # Collect static files
   python manage.py collectstatic --no-input
   ```

5. **Setup Web Server**:
   ```nginx
   # /etc/nginx/sites-available/taskmanager
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://127.0.0.1:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
       
       location /static/ {
           alias /path/to/your/staticfiles/;
       }
       
       location /media/ {
           alias /path/to/your/mediafiles/;
       }
   }
   ```

6. **Setup Process Manager**:
   ```bash
   # Install Gunicorn
   pip install gunicorn

   # Create systemd service
   sudo nano /etc/systemd/system/taskmanager.service
   ```
   ```ini
   [Unit]
   Description=TaskManager Gunicorn daemon
   After=network.target

   [Service]
   User=www-data
   Group=www-data
   WorkingDirectory=/path/to/taskmanager
   ExecStart=/path/to/venv/bin/gunicorn config.wsgi:application --workers 3 --bind 127.0.0.1:8000

   [Install]
   WantedBy=multi-user.target
   ```

7. **Start Services**:
   ```bash
   # Start Gunicorn service
   sudo systemctl start taskmanager
   sudo systemctl enable taskmanager
   
   # Start Nginx
   sudo systemctl restart nginx
   ```

8. **Monitor and Maintain**:
   ```bash
   # Monitor logs
   sudo tail -f /var/log/nginx/error.log
   sudo journalctl -u taskmanager
   
   # Backup database daily
   pg_dump taskmanager_prod > backup_$(date +%Y%m%d).sql
   ```

## 🐛 Troubleshooting

### Common Issues

#### 1. React Build Errors
```powershell
# Clear node_modules and reinstall
cd frontend
Remove-Item -Recurse -Force node_modules, package-lock.json -ErrorAction SilentlyContinue
npm install
# Verify the installation
npm list react react-dom
```

#### 2. Django Migration Issues
```powershell
# First, try making migrations and migrating normally
python manage.py makemigrations
python manage.py migrate

# If still having issues, reset migrations (WARNING: This will delete data)
# 1. Delete migration files (except __init__.py)
Get-ChildItem -Recurse -Filter "*.py" -Include "0*.py" -Path "*/migrations/" | Remove-Item -Force

# 2. Drop the database (for SQLite)
Remove-Item db.sqlite3 -ErrorAction SilentlyContinue

# 3. Recreate migrations and apply them
python manage.py makemigrations
python manage.py migrate
```

#### 3. Port Already in Use
```powershell
# Method 1: Find and kill process using port 8000
$port = 8000
$processId = (Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue).OwningProcess
if ($processId) {
    Stop-Process -Id $processId -Force
    Write-Host "Process using port $port has been terminated"
}

# Method 2: Alternative command
netstat -ano | findstr ":8000"
taskkill /PID <PID> /F

# Method 3: For frontend port 5173
$port = 5173
$processId = (Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue).OwningProcess
if ($processId) {
    Stop-Process -Id $processId -Force
}
```

#### 4. PowerShell Execution Policy
```powershell
# Allow script execution
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### 5. Environment Setup Issues
```powershell
# Verify Python installation and version
python --version

# Verify Node.js installation and version
node --version
npm --version

# Create a new virtual environment
python -m venv env
.\env\Scripts\Activate.ps1

# Verify pip is up to date
python -m pip install --upgrade pip

# Install all dependencies with verbose output
pip install -r requirements.txt -v
```

### Build Errors

If you encounter build errors like "Could not resolve react", try:

1. **Clear npm cache**:
   ```bash
   npm cache clean --force
   ```

2. **Delete node_modules and reinstall**:
   ```bash
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Check React version compatibility**:
   ```bash
   npm list react react-dom
   ```

## 📁 Project Structure

```
taskmanager-main/
├── config/                 # Django settings
├── frontend/              # React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   ├── types/         # TypeScript types
│   │   └── lib/           # Utility functions
│   └── public/            # Static assets
├── projects/              # Projects Django app
├── tasks/                 # Tasks Django app
├── users/                 # Users Django app
├── requirements.txt       # Python dependencies
└── manage.py             # Django management script
```

## � Testing and Quality Assurance

### Backend Tests

```bash
# Run Django tests with coverage
python -m pytest --cov=. --cov-report=html

# Run specific test file
python -m pytest tests/test_tasks.py -v

# Run tests with tags
python -m pytest -m "integration"
```

### Frontend Tests

```bash
# Run Jest tests
cd frontend
npm test

# Run tests with coverage
npm test -- --coverage

# Run E2E tests with Cypress
npm run cypress:open
```

### Code Quality

```bash
# Backend linting
flake8 .
black .
isort .

# Frontend linting
cd frontend
npm run lint
npm run format
```

### Performance Testing

```bash
# Install k6 for load testing
npm install -g k6

# Run load test
k6 run load-tests/performance.js
```

## �🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run all tests and quality checks
   ```bash
   # Backend
   python -m pytest
   flake8 .
   black . --check
   
   # Frontend
   cd frontend
   npm test
   npm run lint
   ```
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Search existing issues
3. Create a new issue with detailed information

## ⚡ Performance Optimization

### Backend Optimization

1. **Database Optimization**:
   ```sql
   -- Add indexes for frequently queried fields
   CREATE INDEX idx_task_status ON tasks_task(status);
   CREATE INDEX idx_task_due_date ON tasks_task(due_date);
   CREATE INDEX idx_project_owner ON projects_project(owner_id);
   ```

2. **Caching Setup**:
   ```python
   # settings.py
   CACHES = {
       'default': {
           'BACKEND': 'django_redis.cache.RedisCache',
           'LOCATION': 'redis://127.0.0.1:6379/1',
           'OPTIONS': {
               'CLIENT_CLASS': 'django_redis.client.DefaultClient',
           }
       }
   }
   
   # Example usage in views
   from django.core.cache import cache
   
   def get_dashboard_data(user_id):
       cache_key = f'dashboard_data_{user_id}'
       data = cache.get(cache_key)
       if data is None:
           data = calculate_dashboard_data(user_id)
           cache.set(cache_key, data, timeout=300)
       return data
   ```

3. **API Optimization**:
   ```python
   # Use select_related and prefetch_related
   tasks = Task.objects.select_related('project', 'assigned_to').all()
   
   # Paginate results
   from rest_framework.pagination import PageNumberPagination
   
   class StandardResultsSetPagination(PageNumberPagination):
       page_size = 100
       max_page_size = 1000
   ```

### Frontend Optimization

1. **Code Splitting**:
   ```typescript
   // Use React.lazy for route-based code splitting
   const Dashboard = React.lazy(() => import('./components/Dashboard'));
   const ProjectView = React.lazy(() => import('./components/ProjectView'));
   ```

2. **Bundle Optimization**:
   ```javascript
   // vite.config.js
   export default defineConfig({
     build: {
       rollupOptions: {
         output: {
           manualChunks: {
             vendor: ['react', 'react-dom'],
             ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
           },
         },
       },
       chunkSizeWarningLimit: 1000,
     },
   });
   ```

3. **Image Optimization**:
   ```typescript
   // Use next/image or similar optimization
   import { ImageOptimizer } from '@/components/ImageOptimizer';
   
   <ImageOptimizer
     src="/path/to/image.jpg"
     width={800}
     height={600}
     quality={75}
   />
   ```

### Monitoring

1. **Setup Monitoring**:
   ```bash
   # Install monitoring tools
   pip install django-debug-toolbar sentry-sdk
   npm install --save @sentry/react
   ```

2. **Performance Logging**:
   ```python
   # settings.py
   LOGGING = {
       'version': 1,
       'handlers': {
           'console': {
               'class': 'logging.StreamHandler',
           },
       },
       'loggers': {
           'django.db.backends': {
               'handlers': ['console'],
               'level': 'DEBUG',
           },
       },
   }
   ```

## 🔄 Updates

To update the project:

```bash
# Backend updates
pip install -r requirements.txt --upgrade
python manage.py migrate
python manage.py collectstatic --no-input

# Frontend updates
cd frontend
npm update
npm run build

# Clear caches
python manage.py clear_cache
redis-cli flushall

# Check for security updates
safety check
npm audit
``` 