# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.apps import AppConfig


class CourseConfig(AppConfig):
    name = 'Course'

    def ready(self):
        import Course.signals