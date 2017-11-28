# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
# from django.contrib.auth.models import User
from .models import Profile, StudentUser
# Register your models here.
#Class ProfileAdmin has everithing that UserAdmin has.
class ProfileAdmin(UserAdmin):
	#Now a list_display can be extended.
	list_display = UserAdmin.list_display + ('pk','type','image_tag')
	#Overriding fieldsets that will be shown when add button clicked
	# (taken from UserAdmin original code)
	add_fieldsets = (
		(None, {
			'classes': ('wide',), #This only formatts columns to be wider.
			'fields': ('username', 'password1', 'password2','type'),
		}),
	)
	#Overriding fieldsets when entered into details
	fieldsets = (
		(None, {'fields': ('username', 'password')}),
		(('Personal info'), {'fields': ('first_name', 'last_name', 'email')}),
		(('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser',
			'groups', 'user_permissions')}),
		(('Important dates'), {'fields': ('last_login', 'date_joined')}),
		#Adding my additional information.
		(('Additional info'), {'fields': ('type','avatar')}),
	)

class StudentAdmin(ProfileAdmin):
	def get_fieldsets(self, request, obj=None):
		fieldsets = list(super(ProfileAdmin, self).get_fieldsets(request, obj))
		# update the `fieldsets` with your specific fields
		#fieldsets.append(('Student specific info', {'fields': ('role',)}))
		return fieldsets

#Registering class in admin panel
admin.site.register(Profile, ProfileAdmin)