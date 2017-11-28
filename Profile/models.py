# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import AbstractUser

#for mark safe
from django.utils.safestring import mark_safe


TYPES = (('Student', 'Student'), ('Teacher', 'Teacher'), )
#Roles student can pick
# STUDENT_CHOICES = (
#     (1, ("Developer")),
#     (2, ("Scrum Master")),
#     (3, ("Product Owner")),
#     (4, ("Tester")),
#     (5, ("Additional Responsibility"))
# 	)

def user_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
    # return 'static/users/user_%s/%s' % (instance.user.user.username, filename)
    return 'static/users/user_{0}/{1}'.format(instance.pk, filename)

# Create your models here.

class UserManager(object):
    def __init__(self, user):
        self.user = user

    @classmethod
    def factory(cls, user):
        """
        Dynamically creates user object
        """
        if cls.__name__.startswith(user.type):  # Children class naming convention is important
            return cls(user)
        for sub_cls in cls.__subclasses__():
            result = sub_cls.factory(user)
            if result is not None:
                return result

class Profile(AbstractUser):
    #some fields here
    #role = models.IntegerField(choices=STUDENT_CHOICES, default=1) #Role needs to be declared for every course individually!
    type = models.CharField(max_length=10, blank = True, choices=TYPES, default='Student')
    avatar = models.ImageField(upload_to=user_directory_path, default='static/defaults/!default_user_avatar/user.gif')# #default didn't quite work. When deleted profile the default img was also deleted

    #Some functions
    #Enabling user avatars in admin panel
    def avatar_url(self):
        """
        Returns the URL of the image associated with this Object.
        If an image hasn't been uploaded yet, it returns a stock image

        :returns: str -- the image url
        """
        if self.avatar and hasattr(self.avatar, 'url'):
            return self.avatar.url
        else:
            return '/static/defaults/!default_user_avatar/user.gif'

    def image_tag(self):
        if self.avatar and hasattr(self.avatar, 'url'):
            return mark_safe('<img src="/%s" width="50" height="50" title="%s"/>' % (self.avatar,self.username))
        else:
            return mark_safe('<img src="/%s" width="50" height="50" />' % ('static/defaults/!default_user_avatar/user.gif'))
    image_tag.short_description = 'User Avatar'

    def goal(self):
        return "My goal is to use Elearning system to learn SCRUM."

    def common_for_all(self):
        return "This is same for all objects!"

class StudentUser(UserManager,Profile):
    #role = models.IntegerField(choices=STUDENT_CHOICES, default=1)
    def __init__(self, *args, **kwargs):
        super(StudentUser, self).__init__(*args, **kwargs)

    def do_something(self):
        return "i'am a student"
    def goal(self):
        return "I'm just a student"


class TeacherUser(UserManager,Profile):
    def do_something(self):
        return "i'am a teacher"
    def goal(self):
        return "I'll teach you scrum!"