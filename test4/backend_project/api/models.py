from django.db import models
from django.utils import timezone

# Create your models here.

class Document(models.Model):
    name = models.CharField(max_length=255)
    content = models.TextField()
    file_type = models.CharField(max_length=50)
    source = models.CharField(max_length=50)
    size = models.IntegerField()
    last_modified = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)

class Analytics(models.Model):
    total_documents = models.IntegerField(default=0)
    storage_used = models.BigIntegerField(default=0)  # in bytes
    recent_searches = models.IntegerField(default=0)
    active_users = models.IntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)
