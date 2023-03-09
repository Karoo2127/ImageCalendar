# アプリのURLを定義するファイル
from django.urls import path
from . import views

app_name = "cal"
urlpatterns = [
    path("", views.index, name="index"),
    path("add/", views.add_event, name="add_event"),
    # path("delete/", views.get_events, name="delete_events"),
    path("list/", views.get_events, name="get_events"),
]