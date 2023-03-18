# テーブル定義に合わせたモデルを作成
from django.db import models

# Create your models here.


class Event(models.Model):
    id = models.BigIntegerField(primary_key=True)
    start_date = models.DateField()
    end_date = models.DateField()
    event_name = models.CharField(max_length=200)
    event_id = models.BigIntegerField()