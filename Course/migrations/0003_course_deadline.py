# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2017-11-19 17:20
from __future__ import unicode_literals

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Course', '0002_auto_20171118_0948'),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='deadline',
            field=models.DateTimeField(blank=True, default=datetime.datetime(2017, 12, 19, 18, 20, 27, 968974)),
        ),
    ]