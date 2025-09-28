FROM python:3.12-slim

# System deps
RUN apt-get update && apt-get install -y --no-install-recommends build-essential && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependencies
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . /app

# Create web directory if not exists
RUN mkdir -p web

ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1

ENV PORT=8080
EXPOSE 8080

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]


