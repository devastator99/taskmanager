# Development Script for TaskManager
Write-Host "Starting TaskManager Development Environment..." -ForegroundColor Green

# Check if Python is installed
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "Python is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

# Check if Node.js is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

# Install Python dependencies
Write-Host "Installing Python dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt

# Install Node.js dependencies
Write-Host "Installing Node.js dependencies..." -ForegroundColor Yellow
Set-Location frontend
npm install
Set-Location ..

# Run Django migrations
Write-Host "Running Django migrations..." -ForegroundColor Yellow
python manage.py migrate

# Start Django server in background
Write-Host "Starting Django server..." -ForegroundColor Green
Start-Process python -ArgumentList "manage.py runserver" -WindowStyle Minimized

# Start React development server
Write-Host "Starting React development server..." -ForegroundColor Green
Set-Location frontend
npm run dev
