# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse #for statuses

from django.core.urlresolvers import reverse #for httpresponseredrect for a named url
from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required
# Create your views here.
from .models import Program, Course, Story, Shout, Quiz,QuizResult
from Profile.models import Profile
from django.core.paginator import Paginator
from .forms import StoryForm
from django.core import serializers #Used i.e. in user roles serialization of profiles.
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

	paginator = Paginator(active_courses, 1)#Declare how many items should be on one page
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
	qr = QuizResult.objects.get(course=course,quiz = quizes[0],profile = request.user)
	if(qr != None and qr.passed == True):
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
			helperMessage = "Choose stories to the Sprint#1."
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
	stories_backlog_primary_0 = course.story_set.all().filter(backlog_primary=0)
	stories_backlog_primary_1 = course.story_set.all().filter(backlog_primary=1)
	stories_backlog_secondary_0 = course.story_set.all().filter(backlog_secondary=0)
	stories_backlog_secondary_1 = course.story_set.all().filter(backlog_secondary=1)


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

@login_required
def product_backlog(request,course_pk):
	"""
	Enables users to pick products for the product release (stories that should be done withing project.)
	"""
	context = {}
	course = Course.objects.get(pk=course_pk)
	context['course'] = course
	if (request.method == 'POST'):
		stickersJson= request.POST.get('stickerList')
		stickers = json.loads(stickersJson)
		for sticker in stickers:
			print(sticker)
			if(sticker['id']):#exists
				temp_story = Story.objects.get(pk=sticker['id'])
			else:
				temp_story = Story()
			temp_story.backlog_primary = sticker['backlog']
			temp_story.save()
			print(temp_story)
	context['form'] = StoryForm()
	context['progress_estimated'] = 5
	return render(request, '2_product_backlog.html',context)

@login_required
def get_course_stickers(request, course_pk):
	context = {}
	course = Course.objects.get(pk=course_pk)
	context['course'] = course
	if (request.method == 'GET'):
		stickers = course.story_set.all()
		stickers = serializers.serialize('json', stickers, fields=('id','backlog_primary','name','content' ))
		print("got GET request..")
		context['stickers'] = stickers
		print(stickers)
	return JsonResponse({'stickers':stickers})

@login_required
def create_new_story(request, course_pk):
	context = {}
	course = Course.objects.get(pk=course_pk)
	profile = Profile.objects.get(pk=request.user.id)
	if (request.method == 'POST'):
		s = Story()
		s.author = profile
		s.name = request.POST.get('name')
		s.content = request.POST.get('content')
		s.course = course
		s.save()
		sticker = serializers.serialize('json', [s], fields=('id','backlog_primary','name','content' ))
	return JsonResponse({'sticker':sticker})

@login_required
def delete_story(request, course_pk):
	context = {}
	if (request.method == 'POST'):
		story_id = int(request.POST.get('story_id'))
		print("In delete_story in POST. Deleting story with id: " + str(story_id))
		story_to_delete = Story.objects.get(pk=story_id)
		story_to_delete.delete();
	return JsonResponse({'id':story_id})

def sprint_backlog(request,course_pk):
	"""
	Enables users to pick products for the product release (stories that should be done withing project.)
	"""
	context = {}
	course = Course.objects.get(pk=course_pk)
	context['course'] = course
	if (request.method == 'POST'):
		print("Got post request :-)")
		stickersJson= request.POST.get('stickerList')
		stickers = json.loads(stickersJson)
		for sticker in stickers:
			print(sticker)
			temp_story = Story.objects.get(pk=sticker['id'])
			temp_story.backlog_primary = sticker['backlog']
			temp_story.save()
	context['form'] = StoryForm()
	context['progress_estimated'] = 7
	#context['progress_estimated'] = 4 #Javascript FrontEnd will disable view if course progress is lower than progress_estimated
	return render(request, '3_sprint_backlog.html',context)

@login_required
def general_discussion(request, course_pk):
	print("In general discussion")
	context = {}
	course = Course.objects.get(pk=course_pk)
	print(course)
	try:
		shouts  = Shout.objects.get(pk = 1)
		context['shouts'] = shouts
	except:
		print("No shouts found for given course.")
	context['course'] = course
	context['progress_estimated'] = 6
	return render(request, '2_general_discussion.html',context)

#views for shouts:
@login_required
def shout_add(request):
    print ("Drukuje id kursu: ")
    print (request.POST.get('course_id'))
    shout_text = request.POST.get('shout')   #Take shout text that is passed from ajax
    print("Just added new shout: " + shout_text)

    course_stage = request.POST.get('course_stage')
    course = Course.objects.get(pk=request.POST.get('course_id')) #Take event_id value that is passed from AJAX
    user = request.user                         #Take the user that posted this request
    shout = Shout.objects.create(author = user, course = course, course_stage = course_stage, date_created = timezone.now(),text = shout_text)
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
    print(request.POST.get('course_id'))
    course_pk = request.POST.get('course_id')
    course = Course.objects.get(pk=int(course_pk)) #Take course_id value that is passed from AJAX
    user = request.user                         #Take the user that posted this request
    event_shouts = Shout.objects.filter(course = course) #event_shouts is a list []
    html = ""
    print("Preparing for html")
    #Create html for every shout in the event_shouts list
    for shout in event_shouts:
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
        html += """<a href=""" + '"' +  '"' + """> <img  src="../../../""" +  str(avatar) + """" class="img-circle"   title="""" + shout.author.username +  """ " /></a>"""
        
        html += shout.text
        html += "</li>"
    return HttpResponse(html) #Return this response i.e. to an AJAX query.