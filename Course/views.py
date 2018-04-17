# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse #for statuses

from django.core.urlresolvers import reverse #for httpresponseredrect for a named url
from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required
# Create your views here.
from .models import Program, Course, Story, Shout, Quiz,QuizResult, CHOICES_SPRINT_STATES
from Profile.models import Profile
from django.core.paginator import Paginator
from .forms import StoryForm
from django.core import serializers #Used i.e. in user roles serialization of profiles.
from django.db.models import Q #For more advanced queries (and or etc.)
@login_required
def course_choose(request,course_name):
	context = {}
	user=request.user
	program = Program.objects.get(slug_name=course_name)
	courses = Course.objects.filter(program=program)
	page = request.GET.get('page', 1)
	paginator = Paginator(courses, 5)#Declare how many items should be on one page
	try:
		courses = paginator.page(page)
	except PageNotAnInteger:
		courses = paginator.page(3)
	except EmptyPage:
		courses = paginator.page(paginator.num_pages)
	context['courses'] = courses
	return render(request, 'course_choose.html',context)

@login_required #using decorator to make sure only logged users can access this page
def course_main(request,course_name):
	context={}
	return render(request, 'main.html',context)

@login_required #using decorator to make sure only logged users can access this page
def course_list(request):
	context={}
	active_courses = Course.objects.filter(students=request.user).order_by('-pk')
	inactive_courses = Course.objects.all().exclude(students=request.user)
	context['active_courses'] = active_courses
	context['inactive_courses'] = inactive_courses
	print (active_courses)

	page = request.GET.get('page', 1)

	paginator = Paginator(active_courses, 5)#Declare how many items should be on one page
	try:
		courses = paginator.page(page)
	except PageNotAnInteger:
		courses = paginator.page(3)
	except EmptyPage:
		courses = paginator.page(paginator.num_pages)
	context['courses'] = courses
	return render(request, 'course_list.html',context)

import json
from django.core import serializers
@login_required #using decorator to make sure only logged users can access this page
def course_detail(request,course_pk):
	context={}
	course = Course.objects.get(pk=course_pk)
	context['course'] = course
	context['progress_estimated'] = 0
	return render(request, 'course_detail.html',context)

@login_required
def course_register(request,course_pk):
	course = Course.objects.get(pk=course_pk)
	course.students.add(request.user)
	return HttpResponseRedirect(reverse('Course:course_list'))

@login_required
def course_unregister(request,course_pk):
	context = {}
	course = Course.objects.get(pk=course_pk)
	course.students.remove(Profile.objects.get(pk = request.user.pk))
	return redirect('Course:course_list')

@login_required
def program_description(request,course_pk):
	context = {}
	course = Course.objects.get(pk=course_pk)
	context['course'] = course
	context['progress_estimated'] = 0
	return render(request, '0_program_description.html',context)

@login_required
def learning_materials(request,course_pk):
	"""
	Returns view with learning materials.
	"""
	context = {}
	course = Course.objects.get(pk=course_pk)
	context['course'] = course
	context['progress_estimated'] = 1
	return render(request, '1_learning_materials.html',context)

@login_required
def quiz(request,course_pk):
	"""
	Returns view with quiz object.
	"""
	context = {}
	course = Course.objects.get(pk=course_pk)
	context['course'] = course
	context['progress_estimated'] = 2
	return render(request, '1_learning_quiz.html',context)


@login_required
def set_progress(request,course_pk):
	course = Course.objects.get(pk=course_pk)
	if (request.method == 'POST'):
		new_progress = request.POST.get('new_progress') #new progress is an integer
		course.set_progress_integer(new_progress)
		course.save()
		print("Progress changed to: " + new_progress)
	#204 = "The server successfully processed the request and is not returning any content"
	#https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#2xx_Success
	return HttpResponse(status=204)


from django.http import JsonResponse
from django.core import serializers
import json
@login_required
def get_quiz(request):
	"""
	View returning quiz for given Course.
	"""
	if (request.method == 'POST'):
		which_course = request.POST.get('course_pk') #new progress is an integer
		course = Course.objects.get(pk=which_course)
		quizes = course.program.quiz.all()

	quiz = serializers.serialize("json", quizes)
	questions = quizes[0].questions.all() #Selecting just first quiz.

	quiz_data = []
	for question in questions:
		quiz_data.append({
			'question': question.question_text,
			'answers': [
				[answer.text, answer.is_valid] for answer in question.answers.all()
			],
		})
	struct = {}
	struct['course_id'] = which_course
	struct['quiz_data'] = quiz_data
	qr,created = QuizResult.objects.get_or_create(course=course,quiz = quizes[0],profile = request.user)
	if(created == True and qr.passed == True):
		struct['already_passed'] = True
	else:
		struct['already_passed'] = False
	#myJsonResponse =  json.dumps(quiz_data)
	myJsonResponse = json.dumps(struct)
	return HttpResponse(myJsonResponse, content_type='application/json')

@login_required
def set_quiz_result(request):
	"""
	Takes post query with results of the Quiz solved by the user.the
	"""
	if (request.method == 'POST'):
		print("Got post request")
		course_id = request.POST.get('course_id') #new progress is an integer
		quiz_id = request.POST.get('quiz_id') #new progress is an integer
		course = Course.objects.get(pk = course_id)
		quiz = Quiz.objects.get(pk = quiz_id)
		points = request.POST.get('points') #new progress is an integer
		quiz_result, created = QuizResult.objects.get_or_create(profile = request.user, course = course, quiz = quiz)
		quiz_result.evaluate(int(points))

	return HttpResponse(status=204)


from django.http import JsonResponse
@login_required
def helper(request):
	"""
	Returns message that is suggesting final user what should be done in the current_stage of the course.
	"""
	print("in helper")
	helperMessage = ""
	if (request.method == 'POST'):
		course_stage = request.POST.get('course_stage')
		print(course_stage)
		if(course_stage == None):
			print("TU")
			helperMessage = "Select a course!"
		elif(course_stage == '0'):
			print("Its a zero!")
			helperMessage = "Read this section to get to know how our SCRUM E-Learning system works."
		elif(course_stage == '1'):
			helperMessage = "Browse through learning materials. They will help you understand the SCRUM methodology."
		elif(course_stage == '2'):
			helperMessage = """Now, since you've read the learning materials you can try to solve a SCRUM quiz.
If you succeed you can proceed to the next course section."""
		elif(course_stage == '3'):
			helperMessage = "Please choose and assign user roles in the current project."
		elif(course_stage == '4'):
			helperMessage = ("See the current progress of the project. " +
							"Analyze statistics of the project. Learn project roles, tasks etc.")

		elif(course_stage == '5'):
			helperMessage = "Choose stories to the project backlog. Other stories will not be included in the project."
		elif(course_stage == '6'):
			helperMessage = """This is a place to discuss the project details before proceeding with the next steps.
								Such as choosing tasks for a Sprint"""
		elif(course_stage == '7'):
			helperMessage = "Choose stories to the current sprint backlog."
		elif(course_stage == '8'):
			helperMessage = "Move stories around Scrum board. Update the board as you make progress with your work."
		elif(course_stage == '9'):
			helperMessage = """Use this panel to write code that will meet story criteria. If you finish your work, you can 
			save your progress to server and proceed with next stage or select different story."""
		elif(course_stage == '10'):
			helperMessage = "Discuss topics connected to Sprint#1 & share your opinions about direction of the project."

	return JsonResponse({'myString':helperMessage})


@login_required
def roles_in_project(request, course_pk):
	context = {}
	course = Course.objects.get(pk=course_pk)
	profiles = course.students.all()
	scrum_masters = course.students_scrum_master.all()
	developers = course.students_developer.all()
	product_owners = course.students_product_owner.all()
	context['course'] = course
	profiles = serializers.serialize('json', profiles, fields=('id','role','username','avatar' ))
	scrum_masters = serializers.serialize('json', scrum_masters, fields=('id','role','username','avatar' ))
	developers = serializers.serialize('json', developers, fields=('id','role','username','avatar' ))
	product_owners = serializers.serialize('json', product_owners, fields=('id','role','username','avatar' ))
	context['profiles'] = profiles
	context['profiles_scrum_master'] = scrum_masters
	context['profiles_developer'] = developers
	context['profiles_product_owner'] = product_owners
	context['progress_estimated'] = 3
	return render(request, '2_roles_in_project.html',context)

import json
@login_required
def set_roles(request):
	"""
	Expects JSON formatted data passed via POST method and sets new roles for given users
	"""
	print("in set roles..")
	helperMessage = ""
	if (request.method == 'POST'):
		profile_list = request.POST.get('profiles')#get list of users from JS frontend.
		profiles = json.loads(profile_list)
		course = request.POST.get('course_pk')
		for profile in profiles:#Loop through each passed profile
			#p = Profile.objects.get(username=profile['username'])
			#p.role = profile['role']
			#First removing profile from every group so that it is not doubled
			edited_profile = Profile.objects.get(username=profile['username'])
			Course.objects.get(pk=course).students_developer.remove(edited_profile)
			Course.objects.get(pk=course).students_scrum_master.remove(edited_profile)
			Course.objects.get(pk=course).students_product_owner.remove(edited_profile)
			try:
				new_role = profile['role']
				print("Found role for: " + edited_profile.username + " new role: " + str(new_role))
				#First clear from the sets
				if(new_role == 1):
					try:
						Course.objects.get(pk=course).students_developer.add(edited_profile)
					except:
						print("Problem during adding as developer.")
				elif(new_role == 2):
					try:
						Course.objects.get(pk=course).students_scrum_master.add(edited_profile)
					except:
						print("Problem during adding as scrum master.")
				elif(new_role == 3):
					try:
						Course.objects.get(pk=course).students_product_owner.add(edited_profile)
					except:
						print("Problem during adding as product_owner.")
				else:
					print("In else statement" + new_role)
					pass
			except:
				pass
			#print("{} has new role: {}".format(profile['username'],profile['role']))

	return JsonResponse({'myString':helperMessage})

from .models import COURSE_STATES
@login_required
def current_progress(request, course_pk):
	context = {}
	course = Course.objects.get(pk=course_pk)
	progress_steps = len(COURSE_STATES)
	progress_current = course.get_progress()
	stories =  course.story_set.all()
	stories_backlog_primary_0 = course.story_set.all().filter(backlog=0)
	stories_backlog_primary_1 = course.story_set.all().filter(backlog=1)
	stories_backlog_secondary_0 = course.story_set.all().filter(sprint_state=0)
	stories_backlog_secondary_1 = course.story_set.all().filter(sprint_state=1)

	print (stories)
	context['course'] = course
	context['progress_estimated'] = 4
	profiles  = Profile.objects.filter(course = course_pk)
	profile_names = []
	for p in profiles:
		profile_names.append(p.username)
	json_profiles = json.dumps(profile_names)
	context['profiles'] = profiles
	context['json_profiles'] = json_profiles
	context['stages_total'] = progress_steps
	context['progress_current'] = progress_current
	context['progress_current_percentage'] = round(progress_current / progress_steps * 100,1)
	context['stories'] = stories
	context['stories_backlog_primary_0'] = stories_backlog_primary_0
	context['stories_backlog_primary_1'] = stories_backlog_primary_1
	context['stories_backlog_secondary_0'] = stories_backlog_secondary_0
	context['stories_backlog_secondary_1'] = stories_backlog_secondary_1
	context['deadline'] = course.deadline
	#Grabbing shouts
	shouts = course.shout_set.all()
	context['json_shouts'] = serializers.serialize('json', shouts, fields=('id','author','text','date_created','course_stage' ))

	return render(request, '2_current_progress.html',context)

########################	START OF BACKLOGS 	###################################################################

@login_required
def get_course_stickers(request, course_pk):
	"""
	Returns stories as JSON for a given course.
	Can be used for i.e. by main project backlog.
	"""
	context = {}
	course = Course.objects.get(pk=course_pk)
	context['course'] = course
	if (request.method == 'GET'):
		#stickers = course.story_set.filter((Q(backlog=1)) | Q(backlog=backlog)) #using Q to filter.
		stickers = course.story_set.all()
		stickers = serializers.serialize('json', stickers, fields=('id','backlog','sprint','sprint_state','name','content','time' ))
		context['stickers'] = stickers
		print("get_course_stickers::" + stickers)
	return JsonResponse({'stickers':stickers})

@login_required
def get_course_sprint_backlog_stickers(request):
	context = {}
	if (request.method == 'POST'):
		course_pk = request.POST.get('course_id')
		sprint = request.POST.get('sprint')
		print("SPRINT::::::::::::::: " + sprint)
		sprint_exclude = 0;
		if(sprint == '1'):
			sprint_exclude = 2
		elif(sprint == '2'):
			sprint_exclude = 1
		course = Course.objects.get(pk=course_pk)
		context['course'] = course
		stickers = course.story_set.filter(Q(Q(backlog=1) & Q(sprint = 0)) | Q(Q(backlog=1) & Q(sprint = sprint)) | Q(Q(backlog=1) & Q(sprint = -1)) ) # (backlog1 and sprint 0) or (backlog1 and sprint as argument)
		print (stickers.query)
		stickers = serializers.serialize('json', stickers, fields=('id','backlog','sprint','sprint_state','name','content','time' ))
		context['stickers'] = stickers
		print("get_course_sprint_stickers:" + stickers)
		print("Tutaj!!!!" + sprint)
	return JsonResponse({'stickers':stickers})

@login_required
def get_course_sprint_stickers(request):
	print("Szukam story dla sprint!")
	context = {}
	if (request.method == 'POST'):
		course_pk = request.POST.get('course_id')
		sprint = request.POST.get('sprint')
		course = Course.objects.get(pk=course_pk)
		context['course'] = course
		stickers = course.story_set.filter(Q(backlog=1) & Q(sprint=sprint) ) #using Q to filter.
		stickers = serializers.serialize('json', stickers, fields=('id','backlog','sprint','sprint_state','name','content','time' ))
		context['stickers'] = stickers
		print("get_course_sprint_stickers:" + stickers)
		print("Tutaj!!!!")
	return JsonResponse({'stickers':stickers})


@login_required
def create_new_story(request, course_pk):
	print("Request to create new story!")
	context = {}
	course = Course.objects.get(pk=course_pk)
	profile = Profile.objects.get(pk=request.user.id)
	if (request.method == 'POST'):
		s = Story()
		s.author = profile
		s.name = request.POST.get('name')
		s.content = request.POST.get('content')
		s.backlog = request.POST.get('backlog')
		s.sprint = request.POST.get('sprint')
		s.sprint_state = request.POST.get('sprint_state')
		s.course = course
		s.save()
		print("Created:" + str(s))
		sticker = serializers.serialize('json', [s], fields=('id','backlog','sprint','sprint_state','name','content' ))
	return JsonResponse({'sticker':sticker})

@login_required
def delete_story(request, course_pk):
	"""
	Delete Story from given Course by given id.
	Course id is passed as Get, story_id is passed via post request.
	"""
	context = {}
	if (request.method == 'POST'):
		story_id = int(request.POST.get('story_id'))
		print("In delete_story in POST. Deleting story with id: " + str(story_id))
		story_to_delete = Story.objects.get(pk=story_id)
		story_to_delete.delete();
	return JsonResponse({'id':story_id})

@login_required
def product_backlog(request,course_pk):
	"""
	Enables users to pick products for the backlog. It can be product backlog or sprint backlog.
	backlog_number specifies what kind of backlog it is:
	i.e. 0=product_backlog, 1=sprint#1_backlog, 2=sprint#2_backlog etc.
	"""
	context = {}
	course = Course.objects.get(pk=course_pk)
	context['course'] = course
	if (request.method == 'POST'):
		print("Got POST request")
		stickersJson= request.POST.get('stickerList')
		stickers = json.loads(stickersJson)
		temp_story = None
		print("Dostalem: " + str(stickers))
		for sticker in stickers:#Synchronizing list of JSON stickers with server.
			try:
				story_id = sticker['id']
				temp_story = Story.objects.get(pk=story_id)
				temp_story.backlog = sticker['backlog']
				if(temp_story.backlog == 1):
					temp_story.sprint = 0
					temp_story.sprint_state = 0
				temp_story.save()
				print("Odnalazlem i zmienilem na: " + str(temp_story))
			except:#If Story with given id doesnt exist then create a new Story object.
				print("Found new Story or id was wrong: " + str(sticker))
				temp_story = Story()
				temp_story.course = course
				temp_story.author = request.user
				temp_story.name = sticker.get('name')
				temp_story.content = sticker.get('content')
				temp_story.backlog = sticker['backlog']
				temp_story.sprint = sticker['sprint']
				temp_story.sprint_state = sticker['sprint_state']

				if(temp_story.backlog != None):#Assume that user moved story to Product/Release backlog. Otherwise don't save it.
					temp_story.save()
					print("Saved new story: " + str(temp_story))
				else:
					print("Sticker not saved! Sticker backlog: "  + str(temp_story.backlog) + " Sticker sprint: " + str(temp_story.sprint) + " Sticker name: " + str(temp_story.name))
			print(temp_story)
	elif(request.method == 'GET'):
		print("Got get request")#get method here
	context['progress_estimated'] = 5
	context['WHICH_BACKLOG'] = 'backlog'
	return render(request, '2_product_backlog.html',context)

@login_required
def sprint_backlog(request, course_pk, sprint_number):
	context = {}
	course = Course.objects.get(pk=course_pk)
	context['course'] = course
	if (request.method == 'POST'):
		print("Got POST request")
		stickersJson= request.POST.get('stickerList')
		stickers = json.loads(stickersJson)
		temp_story = None
		print("Dostalem: " + str(stickers))
		for sticker in stickers:#Synchronizing list of JSON stickers with server.
					try:
						story_id = sticker['id']
						temp_story = Story.objects.get(pk=story_id)
						temp_story.sprint = sticker['sprint']
						temp_story.backlog = sticker['backlog']
						if(temp_story.sprint == 0):
							temp_story.sprint_state = 0
						temp_story.sprint_state = sticker['sprint_state']

						temp_story.save()
					except:#If Story with given id doesnt exist then create a new Story object.
						print("Found new Story or id was wrong: " + str(sticker))
						temp_story = Story()
						temp_story.course = course
						temp_story.author = request.user
						temp_story.name = sticker.get('name')
						temp_story.content = sticker.get('content')
						temp_story.backlog = sticker.get('backlog')
						temp_story.sprint = sticker.get('sprint')
						temp_story.sprint_state = sticker.get('sprint_state')
						if(temp_story.backlog != None):#Assume that user moved story to Product/Release backlog. Otherwise don't save it.
							temp_story.save()
							print("Saved new story: " + str(temp_story))
						else:
							print("Sticker not saved! Sticker backlog: "  + str(temp_story.backlog) + " Sticker sprint: " + str(temp_story.sprint) + " Sticker name: " + str(temp_story.name))
					print(temp_story)
	elif(request.method == 'GET'):
		print("Got get request")#get method here
		context['progress_estimated']  = 7
		context['WHICH_BACKLOG'] = 'sprintBacklog'
		context['SPRINT_NUMBER'] = int(sprint_number)
		print("Przekazuje: " + sprint_number)
	return render(request, '3_sprint_backlog.html',context)

@login_required
def sprint_board(request, course_pk, sprint_number):
	context = {}
	course = Course.objects.get(pk=course_pk)
	context['course'] = course
	if (request.method == 'POST'):
		print("Got POST request")
		stickersJson= request.POST.get('stickerList')
		stickers = json.loads(stickersJson)
		temp_story = None
		print("sprint_board: " + str(stickers))
		for sticker in stickers:#Synchronizing list of JSON stickers with server.
			try:
				story_id = sticker['id']
				temp_story = Story.objects.get(pk=story_id)
				temp_story.backlog = sticker['backlog']
				temp_story.sprint = sticker['sprint']
				temp_story.sprint_state = sticker['sprint_state']
				temp_story.save()
			except:#If Story with given id doesnt exist then create a new Story object.
				print("Found new Story or id was wrong: " + str(sticker))
				temp_story = Story()
				temp_story.course = course
				temp_story.author = request.user
				temp_story.name = sticker.get('name')
				temp_story.content = sticker.get('content')
				temp_story.backlog = sticker.get('backlog')
				temp_story.sprint = sticker.get('sprint')
				if(temp_story.sprint == 0):
					temp_story.sprint_state = 0
				else:
					temp_story.sprint_state = sticker.get('sprint_state')
				if(temp_story.backlog != None):#Assume that user moved story to Product/Release backlog. Otherwise don't save it.
					temp_story.save()
					print("Saved new story: " + str(temp_story))
				else:
					print("Sticker not saved! Sticker backlog: "  + str(temp_story.backlog) + " Sticker sprint: " + str(temp_story.sprint) + " Sticker name: " + str(temp_story.name))
			print(temp_story)
	elif(request.method == 'GET'):
		print("Got get request")#get method here
		context['progress_estimated']  = 8
		context['WHICH_BACKLOG'] = 'sprintBoardBacklog'
		context['SPRINT_NUMBER'] = int(sprint_number)
	return render(request, '3_sprint_board.html',context)

########################	END OF BACKLOGS 	###################################################################
@login_required
def discussion(request, course_pk,course_stage):
	print("In general discussion stage: " + course_stage)
	context = {}
	course = Course.objects.get(pk=course_pk)
	print(course)
	try:
		shouts  = Shout.objects.filter(course = course_pk).filter(course_stage = course_stage)
		context['shouts'] = shouts
	except:
		print("No shouts found for given course.")
	context['course'] = course
	context['progress_estimated'] = course_stage
	return render(request, '3_discussion.html',context)

#views for shouts:
@login_required
def shout_add(request):
    shout_text = request.POST.get('shout')   #Take shout text that is passed from ajax
    course_stage = request.POST.get('course_stage')
    course = Course.objects.get(pk=request.POST.get('course_id')) #Take event_id value that is passed from AJAX
    user = request.user                         #Take the user that posted this request
    shout = Shout.objects.create(author = user, course = course, course_stage = course_stage, date_created = timezone.now(),text = shout_text)
    print("Just added new shout: " + str(shout))
    course_shouts = Shout.objects.filter(course = course, course_stage=course_stage) #event_shouts is a list []
    response = {}
    response = serializers.serialize('json', course_shouts) #if you want to send all filtered shouts
    return HttpResponse(response, content_type='application/json')

from datetime import datetime #for date comparison
from datetime import timedelta
from django.utils import timezone
@login_required
def shout_list(request):
    """Returns a html response and not serialized objects that would have to be manipulated in javascript. This view can be used by javascript on specified intervals."""
    course_pk = request.POST.get('course_id')
    course_stage = request.POST.get('course_stage')
    print(course_stage)
    course = Course.objects.get(pk=int(course_pk)) #Take course_id value that is passed from AJAX
    user = request.user                         #Take the user that posted this request
    event_shouts = Shout.objects.filter(course = course, course_stage = course_stage) #event_shouts is a list []
    print (event_shouts)
    html = ""
    #Create html for every shout in the event_shouts list
    for shout in event_shouts:
        print(str(shout))
        avatar = shout.author.avatar_url()
        #profile_detail = reverse('Profile:profile_detail', args=(shout.author.user.id,))
        html += "<br><li>"
        #This is how to compare two dates
        date1 = shout.date_created + timedelta(+0.5)
        date2 = timezone.now()
        if(date1 <= date2):#if shout was created day before or earlier show date & hours & mins.
            html += shout.date_created.strftime("%Y-%m-%d %H:%M")
        else:
            #print shout.date_created.strftime("%H:%M")
            #print time.time()
            html += shout.date_created.strftime("%H:%M")#else if shout was created today show only hours & mins.
        #html += """<a href=""" + '"' + profile_detail +  '"' + """> <img  src="../../""" +  str(avatar) + """" class="img-circle"   title="""" + shout.author.username +  """ " /></a>"""
        html += """<a href=""" + '"' +  '"' + """> <img  src="../../../../""" +  str(avatar) + """" class="img-circle"   title="""" + shout.author.username +  """ " /></a>"""
        
        html += shout.text
        html += "</li>"
    return HttpResponse(html) #Return this response i.e. to an AJAX query.

@login_required
def task_dashboard(request, course_pk, sprint_number):
	context = {}
	course = Course.objects.get(pk=course_pk)
	stories = Story.objects.filter(course = course, sprint = sprint_number, sprint_state = CHOICES_SPRINT_STATES[1][0] )#For Work-in-progress
	story_list = []
	for s in stories: #for each story create a dict that will be appended to a list and converted to JSON.
		temp_story = {}
		temp_story['id'] = s.id
		temp_story['name'] = s.name
		temp_story['content'] = s.content
		temp_story['solution'] = s.solution
		story_list.append(temp_story)
		print(temp_story['id'])
	context['json_stories'] = json.dumps(story_list)
	context['course'] = course
	context['progress_estimated'] = 9 #Need to change it
	return render(request, '3_task_dashboard.html',context)

@login_required
def save_story_solution(request, course_pk):
	if (request.method == 'POST'):
		story_id= request.POST.get('story_id')
		story_name= request.POST.get('story_name')
		story_solution = request.POST.get('story_solution')
		story = Story.objects.get(pk = story_id)
		story.solution = story_solution
		story.save()
	return HttpResponse(status=204)



@login_required
def get_story_solutions(request, course_pk):
	"""
	Return JSON list of stories for a given course with specified sprint number.
	"""
	if (request.method == 'POST'):
		course = Course.objects.get(pk=course_pk)
		sprint = request.POST.get('sprint')
		print(sprint)
		stories = Story.objects.filter(course = course, sprint = sprint, sprint_state = CHOICES_SPRINT_STATES[1][0] )#For Work-in-progress
		story_list = []
		for s in stories: #for each story create a dict that will be appended to a list and converted to JSON.
			temp_story = {}
			temp_story['id'] = s.id
			temp_story['name'] = s.name
			temp_story['content'] = s.content
			temp_story['solution'] = s.solution
			story_list.append(temp_story)
			print(temp_story['id'])
		json_stories = json.dumps(story_list)

	return HttpResponse(json_stories, content_type='application/json')

