# Generated by Django 4.2.16 on 2024-09-15 10:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('server', '0002_insert_document_data'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='firebaseUID',
            field=models.CharField(max_length=100, null=True),
        ),
    ]
