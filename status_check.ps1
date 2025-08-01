# TaskManager Status Check Script
Write-Host "🔍 Checking TaskManager Application Status..." -ForegroundColor Green

# Check if Django server is running
Write-Host "`n📡 Checking Django Backend..." -ForegroundColor Cyan
try {
    $djangoResponse = Invoke-WebRequest -Uri "http://localhost:8000/api/" -TimeoutSec 5 -ErrorAction Stop
    if ($djangoResponse.StatusCode -eq 200) {
        Write-Host "✅ Django backend is running on http://localhost:8000" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Django backend responded with status: $($djangoResponse.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Django backend is not running or not accessible" -ForegroundColor Red
    Write-Host "   Start it with: python manage.py runserver" -ForegroundColor Yellow
}

# Check if React frontend is running
Write-Host "`n🌐 Checking React Frontend..." -ForegroundColor Cyan
try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:5173/" -TimeoutSec 5 -ErrorAction Stop
    if ($frontendResponse.StatusCode -eq 200) {
        Write-Host "✅ React frontend is running on http://localhost:5173" -ForegroundColor Green
    } else {
        Write-Host "⚠️  React frontend responded with status: $($frontendResponse.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ React frontend is not running or not accessible" -ForegroundColor Red
    Write-Host "   Start it with: cd frontend && npm run dev" -ForegroundColor Yellow
}

# Check database
Write-Host "`n🗄️  Checking Database..." -ForegroundColor Cyan
if (Test-Path "db.sqlite3") {
    $dbSize = (Get-Item "db.sqlite3").Length
    Write-Host "✅ Database file exists (Size: $($dbSize) bytes)" -ForegroundColor Green
} else {
    Write-Host "❌ Database file not found" -ForegroundColor Red
    Write-Host "   Run: python manage.py migrate" -ForegroundColor Yellow
}

# Check environment file
Write-Host "`n⚙️  Checking Environment Configuration..." -ForegroundColor Cyan
if (Test-Path ".env") {
    Write-Host "✅ Environment file (.env) exists" -ForegroundColor Green
} else {
    Write-Host "⚠️  Environment file (.env) not found" -ForegroundColor Yellow
    Write-Host "   Copy env.example to .env and configure it" -ForegroundColor Yellow
}

# Check node_modules
Write-Host "`n📦 Checking Frontend Dependencies..." -ForegroundColor Cyan
if (Test-Path "frontend/node_modules") {
    Write-Host "✅ Frontend dependencies are installed" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend dependencies not installed" -ForegroundColor Red
    Write-Host "   Run: cd frontend && npm install" -ForegroundColor Yellow
}

# Summary
Write-Host "`n📊 Summary:" -ForegroundColor Green
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "   Backend:  http://localhost:8000" -ForegroundColor Cyan
Write-Host "   Admin:    http://localhost:8000/admin" -ForegroundColor Cyan

Write-Host "`n🎉 TaskManager is ready to use!" -ForegroundColor Green
Write-Host "   Open http://localhost:5173 in your browser to get started" -ForegroundColor Cyan 