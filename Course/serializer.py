from rest_framework import serializers
"""
Contains Class Serializers that make it easy to represent Django models as JSON objects.
Use example in a view:
    from .serializer import StorySerializer
    profile = Profile.objects.get(pk=request.user.id)
    my_serializer = StorySerializer(stories, many=True)#many=True is used for serializing multiple objects
    print(my_serializer.data) 
    return JsonResponse({'stories':my_serializer.data})
"""

class ProfileSerializer(serializers.Serializer):
    avatar = serializers.FileField()
    id = serializers.IntegerField()
    username = serializers.CharField()

class EstimationSerializer(serializers.Serializer):
    author = ProfileSerializer()
    time = serializers.IntegerField()

class PokerGameSerializer(serializers.Serializer):
    estimations = EstimationSerializer(many=True)
    get_obligated_users_qs = ProfileSerializer(many=True)
    get_estimation_avg = serializers.FloatField()

class StorySerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    author = ProfileSerializer()
    content = serializers.CharField()
    time = serializers.IntegerField()
    poker_game = PokerGameSerializer()
    is_poker_finished = serializers.BooleanField()



class ProgramSerializer(serializers.Serializer):
    name = serializers.CharField()

class CourseSerializer(serializers.Serializer):
    author = ProfileSerializer()
    program = ProgramSerializer()

class QuizResultSerializer(serializers.Serializer):
    author = ProfileSerializer()
    course = CourseSerializer()
    result = serializers.IntegerField()
    passed = serializers.BooleanField()


