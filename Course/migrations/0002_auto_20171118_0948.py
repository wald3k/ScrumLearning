# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2017-11-18 08:48
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('Course', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='story',
            name='author',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='story',
            name='course',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='Course.Course'),
        ),
        migrations.AddField(
            model_name='shout',
            name='author',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='shout',
            name='course',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Course.Course'),
        ),
        migrations.AddField(
            model_name='question',
            name='quiz',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='questions', to='Course.Quiz'),
        ),
        migrations.AddField(
            model_name='program',
            name='files',
            field=models.ManyToManyField(blank=True, related_name='files', to='Course.LearningMaterial'),
        ),
        migrations.AddField(
            model_name='program',
            name='quiz',
            field=models.ManyToManyField(blank=True, related_name='quizes', to='Course.Quiz'),
        ),
        migrations.AddField(
            model_name='course',
            name='program',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Course.Program'),
        ),
        migrations.AddField(
            model_name='course',
            name='students',
            field=models.ManyToManyField(to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='course',
            name='students_developer',
            field=models.ManyToManyField(related_name='develpers', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='course',
            name='students_product_owner',
            field=models.ManyToManyField(related_name='product_owners', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='course',
            name='students_scrum_master',
            field=models.ManyToManyField(related_name='scrum_masters', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='answer',
            name='question',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='answers', to='Course.Question'),
        ),
    ]
