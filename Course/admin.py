# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin
from .models import Program, Course, LearningMaterial, Story, Quiz, QuizResult, Question, Answer, Shout, Estimation,Poker_game

# Register your models here.
class ProgramAdmin(admin.ModelAdmin):
    list_display = ['name','cover_tag']
    class Meta:
        model = Program

class CourseAdmin(admin.ModelAdmin):
    list_display = ['get_course_name','get_cover_tag']
    class Meta:
        model = Course

class LearningMaterialAdmin(admin.ModelAdmin):
	class Meta:
		model=LearningMaterial

class StoryAdmin(admin.ModelAdmin):
	class Meta:
		model=Story

class QuizAdmin(admin.ModelAdmin):
	class Meta:
		model=Quiz

class QuizResultAdmin(admin.ModelAdmin):
	class Meta:
		model=QuizResult

class QuestionAdmin(admin.ModelAdmin):
	class Meta:
		model=Quiz

class AnswerAdmin(admin.ModelAdmin):
	class Meta:
		model=Quiz

class ShoutAdmin(admin.ModelAdmin):
	class Meta:
		model=Shout

class EstimationAdmin(admin.ModelAdmin):
	class Meta:
		model=Estimation

class Poker_gameAdmin(admin.ModelAdmin):
	class Meta:
		model=Poker_game


#Registering Classes in admin panel
admin.site.register(Program, ProgramAdmin)
admin.site.register(Course, CourseAdmin)
admin.site.register(LearningMaterial, LearningMaterialAdmin)
admin.site.register(Story, StoryAdmin)
admin.site.register(Quiz, QuizAdmin)
admin.site.register(QuizResult, QuizResultAdmin)
admin.site.register(Question, QuestionAdmin)
admin.site.register(Answer, AnswerAdmin)
admin.site.register(Shout, ShoutAdmin)
admin.site.register(Estimation, EstimationAdmin)
admin.site.register(Poker_game, Poker_gameAdmin)

