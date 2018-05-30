# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from .models import Quiz, Question, Answer

import json
from pprint import pprint
import os


"""
This file contains functions for loading Quizes into the DB.
No Forms are required.
In future maybe there should be a special panel that would enable to upload quizes.
"""

def quiz_init():
	cwd = os.path.join(os.getcwd(),'Course/quiz_1.json')
	print(cwd)
	with open(cwd) as data_file:    
		data = json.load(data_file)
	#pprint(data) #pretty print to print Json object.
	quiz_name = data['name']
	new_quiz = Quiz.objects.create(name=quiz_name)
	for i in range(len(data['questions'])):#Looping through questions.
		question_text = data['questions'][i]['question']
		correct_answer_number = data['questions'][i]['correct']#Assuming that JSON file specifies answers starting from 0.		
		q = Question.objects.create(question_text=question_text,quiz = new_quiz)
		for j in range(len(data['questions'][i]['answers'])):#Looping through answers for the question.
			answer_text = data['questions'][i]['answers'][j]
			print("Creating answer: " + answer_text)
			a_q = Answer.objects.create(text=answer_text,question=q)
			if(j == int(correct_answer_number)):#Mark correct as valid.
				a_q.is_valid = True
				a_q.save()
	print("Course initialization finished successfully.")

	# q1 = Question.objects.create(question_text="Does scrum have rules, or just guidelines?",quiz = quiz_1)
	# a_q1_1 = Answer.objects.create(text="Scrum has a few simple rules",question=q1)
	# a_q1_1.is_valid = True
	# a_q1_2 = Answer.objects.create(text="Scrum has guidelines only, no rules at all.",question=q1)