# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from .models import UserManager
from django.http import HttpResponse #used to return html directly
from django.http import HttpResponseRedirect
from django.template.context_processors import csrf
from django.contrib.auth import authenticate, login, logout
from .forms import MyRegistrationForm
from django.contrib.auth.decorators import login_required

#For Ajax/request javascript
import json

# Create your views here.
def test_view(request):
	str_message = "<h2>"
	school_user = UserManager.factory(request.user)
	str_message += "type: "+ request.user.type
	str_message += "<br> username: "+ request.user.username
	str_message += "<br> do_something: " + school_user.do_something()
	str_message += "<br> goal: " + school_user.goal()
	str_message += "<br> common_for_all: " + school_user.common_for_all()
	str_message += "</h2>"
	school_user.save()
	 # each class can have different behaviour
	return HttpResponse(str_message)


def login_profile(request):
    logout(request)
    username = password = ''
    if request.POST:
        username = request.POST['username']
        password = request.POST['password']
        print (username)
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                login(request, user)
                return HttpResponseRedirect('/')
    return HttpResponseRedirect('/')
"""
Creating a new Profile by users.
"""
def register_profile(request,user_type):
    context = {}                                                                #create a context dictionary
    if request.user.is_authenticated():
        logout(request)
        print("User is authenticated, starting to redirect to proper webpage!!1!!!!!!!")
        return HttpResponseRedirect('/')
    else:
        if request.method == 'POST':
            form = MyRegistrationForm(data=request.POST, files=request.FILES)
            if form.is_valid():                  #validation of the form
                print("Form was valid :))")
                newly_created_user = form.save() #reference to created User object. It fires post_save function.
                newly_created_user.avatar = form.cleaned_data['avatar']
                newly_created_user.save()
                newly_created_user.save()
               #logging newly created user
                new_user = authenticate(username=form.cleaned_data['username'],
                                    password=form.cleaned_data['password1'],
                                    )
                login(request, newly_created_user)
                return HttpResponseRedirect('/')
            print("Form was invalid!!!!!")
        else:                                                     #Entered here from method GET i.e. by typing address. It means that new form will be created.
            if(user_type.upper() =="TEACHER"):
                initials = {'type': 'Teacher'} 
            else:     
                initials = {'type': 'Student'}
            form = MyRegistrationForm(initial=initials,readonly_form = True)                                     #creating new empty form
            context.update(csrf(request))
            context['form'] = form
            return render(request, 'register_profile.html', context)
def logout_profile(request):
    if request.user.is_authenticated():
        logout(request)
    return HttpResponseRedirect('/')

def logged(request):
    context={}
    return render(request, '/logged', context)

def ajax_test(request):
    import time
    ajax_vars = {'response': 'myResponse', 'email': 'myEmail@wp.pl'}
    json_data = json.dumps(ajax_vars)
    return HttpResponse(json_data, content_type='application/json')

@login_required #using decorator to make sure only logged users can access this page
def main(request):
    print("dupa")
    context={}
    return render(request, 'main.html',context)

