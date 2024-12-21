from django.db import models
from django.contrib.auth.models import User

# Task Model
class Task(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Link each task to a user
    title = models.CharField(max_length=200)
    description = models.TextField()
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title