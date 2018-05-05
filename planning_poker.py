if __name__ == "__main__":
	import os
	os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ScrumLearning.settings")
	import django
	django.setup()
	from Course.models import Story, Course, Profile,Estimation

from itertools import chain#for mering list of querysets
class Planning_poker():
	"""
	Represents a Planning Poker process.
	course - reference to Couse object
	stories - Queryset holding all stories for this Course instance.
	allowed_voters - Queryset for all Developers/Scrum Masters that are participants of the course.
	"""
	def __init__(self,course):
		self.course = course
		self.stories = course.story_set.all()
		self.allowed_voters = course.students_scrum_master.all() | course.students_developer.all() #merging lists
		print("Created planning poker for course...")

	def stories_ready(self):
		"""Returns a Queryset with estimated stories."""
		return self.stories.filter(estimated=True)

	def stories_to_play(self):
		"""Returns a Queryset with unestimated stories."""
		return self.stories.filter(estimated=False)

	def can_vote(self,user_id,story_id):
		""" Returns true if user with given id can vote in Scrum Poker. If not, returs false."""
		try:
			story = self.stories.get(id=story_id)
			voter = self.allowed_voters.get(id=user_id)
			print(story)
			print(voter)
			if not story or not voter:
				print("Story or voter is wrong")
				return False
			else:
				if(voter in story.estimators.all()):
					return False
			return True
		except:
			return False

	def add_estimation(self,user_id,story_id,estimated_time):
		""" Adding an estiation for selected story by selected user."""
		if self.can_vote(user_id,story_id) == False:
			print("Cannot vote")
		else:
			story = self.stories.get(id=story_id)
			voter = self.allowed_voters.get(id=user_id)
			Estimation.objects.create(author = voter, story = story, time=estimated_time)
			story.estimators.add(voter)
			story.save()
			print("Estimate added.")

	def remove_estimator(self,user_id,story_id):
		""" """
		story = self.stories.get(id=story_id)
		author = Profile.objects.get(pk=user_id)
		story.estimators.remove(author)
		Estimation.objects.get(story = story, author = author).delete()

	def is_estimation_finished(self, story_id):
		""" Returs True if everyone from allowed_voters made an estimate. Else returs False."""
		story = self.stories.get(id=story_id)
		print(list(story.estimators.all()))
		print(list(self.allowed_voters))
		if(set(list(story.estimators.all())) == set(list(self.allowed_voters))):
			print("Planning poker for " + str(story) + " is done!")
			return True
		else:
			print("Planning poker in progress.")
			return False
		print("finished..")

#Settings
course_pk = 1
user_id = 3
story_id = 113
c = Course.objects.get(pk=course_pk)
pp = Planning_poker(c)
pp.add_estimation(user_id,story_id,60)
print(pp.is_estimation_finished(story_id))
#pp.remove_estimator(user_id,story_id)

