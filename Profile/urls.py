from django.conf.urls import url
from . import views

#My imports
from django.contrib.auth import views as contrib_views
urlpatterns = [
    url(r'^test/$', views.test_view, name='test'),
    url(r'^register/(?P<user_type>\w+)/$', views.register_profile, name='register_profile'),
	url(r'^logged/$', views.logged, name='logged'),
	url(r'^logout/$', views.logout_profile, name='logout_profile'),
	url(r'^login/$', views.login_profile, name='login_profile'),
	url(r'^main/$', views.main, name='main'),
]