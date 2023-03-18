# これはDjangoのURLルーティング機能を定義するファイルです。 
# URLリクエストがアプリケーションに送信された場合、Djangoはurls.pyファイルに定義されたパターンを検索し、
# リクエストを適切なビュー関数にディスパッチします。
# アプリのURLを定義するファイル
from django.urls import path
from . import views

app_name = "cal"
urlpatterns = [
    path("", views.index, name="index"),
    path("add/", views.add_event, name="add_event"),
    path("delete/", views.delete_event, name="delete_event"),
    path("list/", views.get_events, name="get_events"),
]