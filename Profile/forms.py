from django import forms
from django.contrib.auth.forms import UserCreationForm
from . models import Profile
from django.template.context_processors import csrf


class MyRegistrationForm(UserCreationForm):
    READONLY_FIELDS = ('type',)
    email = forms.EmailField(required=True)
    avatar = forms.ImageField(required=False)
    class Meta:
        model = Profile
        fields = ('username', 'password1', 'password2', 'email','type',)
    def __init__(self, readonly_form=False,*args,**kwargs):
        super(MyRegistrationForm, self).__init__(*args,**kwargs)
        if readonly_form:
            for field in self.READONLY_FIELDS:
                self.fields[field].widget.attrs['disabled'] = True
    def save(self, commit=False):
        user = super(MyRegistrationForm, self).save(commit=False)
        user.username = self.cleaned_data['username']
        user.email = self.cleaned_data['email']
        if user.email and Profile.objects.filter(email=user.email).exclude(username=user.username).count():    #Check if email address is unique, otherwise raise exception
            raise forms.ValidationError(u'Email addresses must be unique.')
        if commit:
            user.save()
        return user