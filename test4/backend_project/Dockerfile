# Use the official Python image
FROM python:3.10

# Set environment variables to prevent Python from buffering outputs
ENV PYTHONUNBUFFERED=1

# Disable SSL verification for PIP (Temporary Fix)
ENV PIP_NO_SSL_VERIFY=1

# Set working directory inside the container
WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && pip install --trusted-host pypi.python.org --trusted-host pypi.org --trusted-host files.pythonhosted.org -r requirements.txt

# Copy the entire backend project into the container
COPY . .

# Expose the port that Django runs on
EXPOSE 8000

# Run Django server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]