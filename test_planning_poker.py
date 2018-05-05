if __name__ == "__main__":
	import os
	os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ScrumLearning.settings")
	import django
	django.setup()
	from Course.models import Story, Course, Profile,Estimation, Poker_game


game = Poker_game.objects.get(pk=1)
which_user = 3
print ("Poker game created.")
if(game.user_allowed_to_vote(which_user)):
	print("Adding an estimation...")
	game.add_estimation(which_user,55)

game.is_finished()
game.add_estimation(2,5)