# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from Profile.models import Profile

#for mark safe
from django.utils.safestring import mark_safe
from django.utils import timezone
from datetime import datetime,timedelta
# Create your models here.

class LearningMaterial(models.Model):
	file = models.FileField (upload_to = "static/pdf", max_length=20000,  blank=True)
	desc = models.TextField(blank=True)

	def __str__(self):
		return self.desc + ": " + self.file.name

def cover_directory_path(instance, filename):
	# file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
	# return 'static/users/user_%s/%s' % (instance.user.user.username, filename)
	return 'static/courses/course_{0}/{1}'.format(instance.pk, filename)

class Quiz(models.Model):
	"""
	Represents a single Quiz object.
	"""
	name = models.CharField(max_length=64, verbose_name=u'Exam name', )

class Question(models.Model):
	"""
	Represents a single Question object that has a relation with one specific Quiz object.
	"""
	question_text = models.CharField(max_length=256, verbose_name=u'Question\'s text')
	quiz = models.ForeignKey(Quiz, related_name='questions')

	def __str__(self):
		return "{content}".format(content=self.question_text)


class Answer(models.Model):
	"""
	Answer's Model, which is used as the answer in Question Model
	"""
	text = models.CharField(max_length=256, verbose_name=u'Answer\'s text')
	is_valid = models.BooleanField(default=False)
	is_checked = models.BooleanField(default=False)
	question = models.ForeignKey(Question, related_name='answers')

	def __str__(self):
		return self.text


class Program(models.Model):
	name = models.CharField(max_length=64, blank=False, null=False, unique=True)
	slug_name = models.SlugField(max_length=64, blank=False, null=False, unique=True)
	description = models.TextField(blank=True)
	files = models.ManyToManyField(LearningMaterial, related_name='files', blank=True)#
	cover = models.ImageField(upload_to=cover_directory_path, default='static/defaults/default_course_cover/cover.png')
	quiz = models.ManyToManyField(Quiz, related_name='quizes', blank=True)#

	def cover_tag(self):
		if self.cover and hasattr(self.cover, 'url'):
			return mark_safe('<img src="/%s" width="50" height="50" />' % (self.cover))
		else:
			return mark_safe('<img src="/%s" width="50" height="50" />' % ('static/defaults/default_course_cover/cover.png'))
		image_tag.short_description = 'Course Cover'
	def __str__(self):
		return self.name + self.cover_tag()
	def link(self):
		"""
		Return name without spaces
		"""
		if self.name:
			self.name = self.name.strip()


BACKLOGS_PRIMARY = (
	(0, ("PRODUCT_BACKLOG")),
	(1, ("RELEASE_BACKLOG")),
	)

BACKLOGS_SECONDARY = (
	(0, ("NOT_ASSIGNED")),
	(1, ("SPRINT_1")),
	(2, ("SPRINT_2")),
	)
class Story(models.Model):
	backlog_primary = models.IntegerField(choices=BACKLOGS_PRIMARY, default=0) #Decide if tory will be included in Product Backlog.
	backlog_secondary = models.IntegerField(choices=BACKLOGS_SECONDARY, default=0) #Decide during which sprint story will be developed.
	name = models.CharField(max_length=64, blank=False, null=False, unique=True)
	content = models.TextField()
	author = models.ForeignKey('Profile.Profile', on_delete=models.CASCADE)
	course = models.ForeignKey('Course', on_delete=models.CASCADE, null=True)

	def __str__(self):
		return "{name}:    {content}. Created by: {author}".format(name=self.name,content=self.content,author = self.author.username)



#############################################
# Declare states that course could be in.   #
# This can be used by many different models #
#############################################

COURSE_STATES = (
	(0, ("OVERVIEW")),
	(1, ("LEARNING_MATERIALS")),
	(2, ("QUIZ")),
	(3, ("ROLES_IN_PROJECT")),
	(4, ("CURRENT_PROGRESS")),
	(5, ("PRODUCT_BACKLOG")),
	(6, ("GENERAL_DISCUSSION")),
	(7, ("SPRINT_1")),
	(8, ("RETROSPECTION_1")),
	(9, ("SPRINT_1")),
	(10, ("RETROSPECTION_1")),
	(11, ("FINAL_RESULTS")),
	)

STUDENT_CHOICES = (
    (1, ("Developer")),
    (2, ("Scrum Master")),
    (3, ("Product Owner")),
    (4, ("Tester")),
    (5, ("Additional Responsibility"))
	)

class Course(models.Model):
	program = models.ForeignKey('Program', on_delete=models.CASCADE)
	students = models.ManyToManyField(Profile) #to get list simply course.students.all()
	students_scrum_master = models.ManyToManyField(Profile,related_name='scrum_masters') #to get list simply course.students.all()
	students_developer = models.ManyToManyField(Profile,related_name='develpers') #to get list simply course.students.all()
	students_product_owner = models.ManyToManyField(Profile,related_name='product_owners') #to get list simply course.students.all()
	created = models.DateTimeField(editable=False)
	modified = models.DateTimeField(editable=False)
	deadline = models.DateTimeField(default=datetime.now()+timedelta(days=30),blank=True)
	_progress = models.IntegerField(choices=COURSE_STATES, default=0)

	def __str__(self):
		return "Course: " + self.program.name + " === course id: " + str(self.pk)

	def save(self, *args, **kwargs):
		""" On save, update timestamps """
		if not self.id:
			self.created = timezone.now()
			self.modified = self.created
		self.modified = timezone.now()
		return super(Course, self).save(*args, **kwargs)

	def get_course_name(self):
		return self.program.name
	get_course_name.short_description = 'Program name'

	def get_cover_tag(self):
		return self.program.cover_tag()
	get_cover_tag.short_description = 'Cover tag'

	def set_progress(self, value):
		"""
		Sets progress value only if it is in COURSE_STATES tuple.
		"""
		phases = dict(COURSE_STATES)  # Conversion to a dictionary mapping.
		value = str(value).upper()    # Convert value to uppercase string.
		for key, val in phases.items():
			if(val == value):
				self._progress = key
				return
	def set_progress_integer(self, progreess_integer):
		try:
			self._progress = progreess_integer
		except:
			print("Passed argument is not an Integer!")
		print("Progress set to: " + self._progress)

	def get_progress(self):
		return self._progress

	def can_access_progress(self,requested_progress):
		"""
		Determines if user can access requested course status.
		"""
		current_status = self._progress
		print("Current status " + str(self._progress))
		new_status = 0
		phases = dict(COURSE_STATES)  # Conversion to a dictionary mapping.
		requested_progress = str(requested_progress).upper()    # Convert value to uppercase string.
		for key, val in phases.items():
			if(val == requested_progress):
				new_status = key
		if(new_status < current_status):
			return True
		else:
			return False


class Shout(models.Model):
	"""
	This class represents a shout which is a short text message posted by a profile.
	"""
	author = models.ForeignKey('Profile.Profile', on_delete=models.CASCADE) #remember to add appname before model name.
	course = models.ForeignKey('Course.Course', on_delete=models.CASCADE) #remember to add appname before model name.
	course_stage = models.IntegerField(choices=COURSE_STATES, default=4)
	text = models.TextField()	
	date_created = models.DateTimeField(editable=False)
	def __str__(self):
		"""
		Displays Shout in admin panel.
		Returns:
		string: Author + text
		"""
		return '%s: %s' %(self.author.username,self.text)

	def save(self, *args, **kwargs):
		''' On save, update timestamps '''
		if not self.id:
			self.date_created = timezone.now()
		return super(Shout, self).save(*args, **kwargs)



class QuizResult(models.Model):
	profile = models.ForeignKey('Profile.Profile', on_delete=models.CASCADE) #remember to add appname before model name.
	course = models.ForeignKey('Course.Course', on_delete=models.CASCADE) #remember to add appname before model name.
	quiz = models.ForeignKey('Course.Quiz', on_delete=models.CASCADE) #remember to add appname before model name.
	result = models.IntegerField(default=0) #By default set to 0 points.
	passed = models.BooleanField(default=False)

	def evaluate(self,points):
		"""
		Evaluate if quiz has been passed and update best result.
		"""
		if(points / len(self.quiz.questions.all()) >= 0.5):
			self.passed = True
		if(points >= self.result):
			self.result = points
		self.save()

