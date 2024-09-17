from django.db import models

class User(models.Model):
    email = models.CharField(max_length=50)
    name = models.CharField(max_length=100)
    firebaseUID = models.CharField(max_length=100, null=True)

    def __str__(self):
        return self.name
    
class Document(models.Model):
    name = models.CharField(max_length=100)
    document_path = models.TextField()
    output_path = models.TextField()

    def __str__(self):
        return self.name
