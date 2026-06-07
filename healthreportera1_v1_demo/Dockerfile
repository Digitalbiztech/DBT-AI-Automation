# Use official slim Python image
FROM python:3.11-slim

# Install minimal system dependencies
RUN apt-get update && apt-get install -y \
    git \
    && rm -rf /var/lib/apt/lists/*
    
# Set working directory
WORKDIR /app

# Copy requirements first to leverage Docker cache
COPY api_report/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt


# Environment variables for Python
ENV PYTHONUNBUFFERED=1

# Copy application code
COPY api_report/ .

# Expose port (Render sets $PORT env var)
EXPOSE 8000

# Start Command - use shell form to allow $PORT expansion
CMD sh -c "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"
