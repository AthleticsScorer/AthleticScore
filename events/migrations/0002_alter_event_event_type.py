# Generated by Django 4.2.13 on 2024-05-30 14:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='event_type',
            field=models.CharField(choices=[('Distance', 'distance'), ('Time', 'time')], max_length=30),
        ),
    ]