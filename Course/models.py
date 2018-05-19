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

	class Meta:
		verbose_name = 'Quiz'
		verbose_name_plural = 'Quizes'

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


CHOICES_BACKLOG = (
	(0, ("NOT_SELECTED")),
	(1, ("PRODUCT_BACKLOG")),
	)

CHOICES_SPRINT_STATES = (
	(0, ("NOT_SELECTED")),
	(1, ("NOT_STARTED")),
	(2, ("IN_PROGRESS")),
	(3, ("COMPLETED")),
	)
CHOICES_SPRINT= (
	(0, ("NOT_SELECTED")),
	(1, ("SPRINT_1")),
	(2, ("SPRINT_2")),
	)

class Story(models.Model):
	"""
	Represents short user story. Stories are used to descsribe some short task during Scrum process.
	Every Story belongs to some kind o a backlog, has name, content, author and is assigned to a course(Stories should 
	not be connected to program, because users should be able to add their own stories durinsg course).
	When Story is in a **BACKLOG**, it can be placed in different places on a **BACKLOG BOARD aka BACKLOG_STATE** i.e.:wip,to-do,completed, etc.
	"""
	backlog = models.IntegerField(choices=CHOICES_BACKLOG, default=0) #Decide in which Backlog story will be included.
	sprint =models.IntegerField(choices=CHOICES_SPRINT, default=0)
	sprint_state = models.IntegerField(choices=CHOICES_SPRINT_STATES, default=0) #Decide where on backlog board story should be(wip,to-do etc.)
	name = models.CharField(max_length=64, blank=False, null=False, unique=False)
	content = models.TextField()
	author = models.ForeignKey('Profile.Profile', on_delete=models.CASCADE)
	course = models.ForeignKey('Course', on_delete=models.CASCADE, null=True)
	solution = models.TextField(blank=True, null = True)
	solution_test = models.TextField()
	perfect_solution = models.TextField(null=True)#An example how the Story could be solved
	time = models.IntegerField(default=1000) #for planning poker & estimations
	is_poker_finished = models.BooleanField(default=False)

	class Meta:
		verbose_name = 'Story'
		verbose_name_plural = 'Stories'

	def __str__(self):
		return "{name}:    {content}. Created by: {author}. Backlog: {backlog}, Sprint: {sprint}, Sprint_State: {sprint_state} ".format(name=self.name,content=self.content,author = self.author.username, backlog = self.backlog,sprint = self.sprint, sprint_state = self.sprint_state)


class Poker_game(models.Model):
	""" Represents a Scrum Poker game for a Story.
		story - reference to Story object.
		estimations - reference to list of estimations done for the story.
	"""
	story = models.OneToOneField('Story',on_delete=models.CASCADE,blank=False,null=True)
	estimations = models.ManyToManyField('Estimation',related_name='estimations')

	def __str__(self):
		return "Poker game for story: {story_name}".format(story_name=self.story)
	def user_allowed_to_vote(self, user_id):
		""" Returns true if user with given id can vote in Scrum Poker. If not, returs false."""
		if(self.obligated_to_estimate(user_id) == True and self.__already_voted(user_id) == False):
			return True
		return False

	def get_obligated_users_qs(self):
		""" Returns a Queryset with users that should estimate a story."""
		return 	self.story.course.students_scrum_master.all() | \
			self.story.course.students_developer.all() #merging lists into Queryset

	def obligated_to_estimate(self,user_id):
		""" Users that are either developers or scrum master(s) should make estimation"""
		obligated_users = self.get_obligated_users_qs()
		try:
			voter = obligated_users.get(id=user_id)
		except Profile.DoesNotExist:
			print("Profile with id: " + str(user_id) + " does not exist!")
			return False
		if voter in obligated_users:
			return True
		return False

	def __already_voted(self,user_id):
		""" Checks if user with given id has already estimated the story."""
		try:
			temp_profile = Profile.objects.get(pk=user_id)
		except Profile.DoesNotExist:
			print("Profile does not exist!")
			return False
		qs = Estimation.objects.filter(author=temp_profile,story = self.story)
		if not qs.count(): #qmpty queryset
				return False
		return True

	def add_estimation(self,user_id,estimated_time):
		""" Adding an estiation for selected story by selected user."""
		estimation = None
		if self.user_allowed_to_vote(user_id) == False:
			print("Cannot vote")
		else:
			try:
				voter = self.get_obligated_users_qs().get(id=user_id)
				estimation = Estimation.objects.create(author = voter, story = self.story, time=estimated_time)
				self.estimations.add(estimation)
				print("Estimate added.")
				print("Is finished: " + str(self.is_finished()))
				if (self.is_finished()):
					self.story.is_poker_finished = True
				print("get_estimation_avg: " + str(self.get_estimation_avg()))
				self.story.time = self.get_estimation_avg()
				self.story.save()
			except Profile.DoesNotExist:
				print("Profile does not exist!")
		
		return estimation

	def __get_current_estimations(self):
		return Estimation.objects.filter(story=self.story) #Queryset of all estimations
	
	def is_finished(self):
		""" Returs True if everyone from allowed_voters made an estimate. Else returs False."""
		estimators = []
		for estimation in list(self.__get_current_estimations()):
			estimators.append(estimation.author)
		if(set(estimators) == set(list(self.get_obligated_users_qs()))):
			print("Planning poker for " + str(self.story) + " is done!")
			return True
		else:
			print("Planning poker in progress.")
			return False
		print("finished..")

	def get_estimation_avg(self):
		estimations_sum = 0
		estimations_avg = 0
		estimations = list(self.__get_current_estimations())
		for estimation in estimations:
			estimations_sum = estimations_sum + estimation.time
		avg = 0
		try:
			estimations_avg = estimations_sum / len(estimations)
		except ZeroDivisionError:
			estimations_avg = 0
		else:
			print("Some other Exception..")
		return estimations_avg

class Estimation(models.Model):
	""" Represents a single Estimation for a specified Story made by a member of a team (Profile)."""
	author = models.ForeignKey('Profile.Profile', on_delete=models.CASCADE)
	story = models.ForeignKey('Story',on_delete=models.CASCADE,related_name='story')
	time = models.IntegerField(default=999)

	def get_user_id(self):
		return self.author.id

	def get_time(self):
		return self.time

	def __str__(self):
		return "Profile: {author_id} estimated story with id: {story_id} to {estimation} points.".format(author_id=self.author.id,story_id=self.story.id,estimation=self.time)

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
	(7, ("SCRUM_POKER")),
	(8, ("SPRINT_1_BACKLOG")),
	(9, ("SPRINT_1_BOARD")),
	(10, ("SPRINT_1_DASHBOARD")),
	(11, ("SPRINT_1_DISCUSSION")),
	(12, ("SPRINT_1_RETROSPECTION")),
	(13, ("SPRINT_2_BACKLOG")),
	(14, ("SPRINT_2_BOARD")),
	(15, ("SPRINT_2_DASHBOARD")),
	(16, ("SPRINT_2_DISCUSSION")),
	(17, ("SPRINT_2_RETROSPECTION")),
	(18, ("FINAL_RESULTS")),
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
		return '%s: %s course: %s course_stage: %s' %(self.author.username,self.text, self.course, self.course_stage)

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

