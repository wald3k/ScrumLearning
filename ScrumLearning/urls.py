"""ScrumLearning URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin

#For adding static & media url
from django.conf import settings
from django.conf.urls.static import static
from Profile.views import logout_profile,ajax_test
from . import views
urlpatterns = [
    url(r'^admin/logout/$', logout_profile),
    url(r'^admin/', admin.site.urls),
    url(r'^profile/', include('Profile.urls', namespace='Profile')), #namespace can be used in templates i.e. <a href="{% url 'Profile:profile_detail' user.userprofile.id %}">
    url(r'^course/', include('Course.urls', namespace='Course')),
 	#url(r'^$', TemplateView.as_view(template_name='index.html'),name="index_page"),
    url(r'^$', views.index_page,name="index_page"),
    url(r'^dupa/$', ajax_test),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)