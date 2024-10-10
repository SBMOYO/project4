FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt /app/

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . /app/

# Collect static files
RUN python manage.py collectstatic --noinput

# Expose port 8000 to the world outside this container
EXPOSE 8000

# Define environment variable
ENV PYTHONUNBUFFERED=1

# Run the Gunicorn server
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "project4.wsgi:application"]
