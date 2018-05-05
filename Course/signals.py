from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Story, Poker_game

@receiver(post_save, sender=Story)
def create_poker_game(sender, instance, created, **kwargs):
    """ Creates a poker game for each instance of newly created Story object."""
    print(instance)
    if created:
        Poker_game.objects.create(story=instance)