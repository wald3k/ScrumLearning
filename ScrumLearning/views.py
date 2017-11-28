# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import HttpResponse #used to return html directly
from django.http import HttpResponseRedirect

#Importing models
from Course.models import Program

def index_page(request):
	context = {}
	programs = Program.objects.all()
	print (programs)
	context['programs'] = programs
	print ("Index main page!!!")
	return render(request, 'index.html', context)