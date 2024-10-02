from django.db import models

# Create your models here.
class PongResult(models.Model):
    user1 = models.CharField(max_length=200)
    user2 = models.CharField(max_length=200)
    # date = models.DateTimeField()
    class Meta:
        db_table = 'pong_result'
        # ordering = ['-date_published']
