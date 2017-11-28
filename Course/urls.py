from django.conf.urls import url
from . import views
from django.views.generic import TemplateView #To go straight to a template view i.e. about/contact pages

#My imports
from django.contrib.auth import views as contrib_views
urlpatterns = [
    url(r'^course_choose/(?P<course_name>.+)/$', views.course_choose, name='course_choose'),
    url(r'^course_main/(?P<course_name>.+)/$', views.course_main, name='course_main'),
    url(r'^course_list/$', views.course_list, name='course_list'),
    url(r'^course_detail/(?P<course_pk>\d+)/$', views.course_detail, name='course_detail'),
    url(r'^course_register/(?P<course_pk>\d+)/$', views.course_register, name='course_register'),
    url(r'^course_unregister/(?P<course_pk>\d+)/$', views.course_unregister, name='course_unregister'),
    url(r'^program_description/(?P<course_pk>\d+)/$', views.program_description,name="program_description"),
    url(r'^1_learning_materials/(?P<course_pk>\d+)/$', views.learning_materials,name="learning_materials"),
    url(r'^1_quiz/(?P<course_pk>\d+)/$', views.quiz,name="quiz"),
    url(r'^(?P<course_pk>\d+)/set_progress/$', views.set_progress,name="set_progress"),
    url(r'^get_quiz/$', views.get_quiz,name="get_quiz"),
    url(r'^set_quiz_result/$', views.set_quiz_result,name="set_quiz_result"),
    url(r'^helper/$', views.helper,name="helper"),
    url(r'^2_roles_in_project/(?P<course_pk>\d+)/$', views.roles_in_project,name="roles_in_project"),
    url(r'^set_roles/$', views.set_roles,name="set_roles"),   
    url(r'^current_progress/(?P<course_pk>\d+)/$', views.current_progress,name="current_progress"),   
    url(r'^2_product_backlog/(?P<course_pk>\d+)/$', views.product_backlog,name="product_backlog"),
    url(r'^2_general_discussion/(?P<course_pk>\d+)/$', views.general_discussion,name="general_discussion"),
    url(r'^shout_list/$', views.shout_list,name="shout_list"),
    url(r'^shout_add/$', views.shout_add,name="shout_add"),
    url(r'^get_course_stickers/(?P<course_pk>\d+)/$', views.get_course_stickers,name="get_course_stickers"),
    url(r'^create_new_story/(?P<course_pk>\d+)/$', views.create_new_story,name="create_new_story"),
    url(r'^delete_story/(?P<course_pk>\d+)/$', views.delete_story,name="delete_story"),
    url(r'^sprint_backlog/(?P<course_pk>\d+)/$', views.sprint_backlog,name="sprint_backlog"),
]