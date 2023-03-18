# Djangoアプリケーションのロジックを実装する場所です。
# ビュー関数は、リクエストを受け取り、それに応じて必要な処理を実行し、HTTPレスポンスを返します。
# ビュー関数は、HTMLテンプレートをレンダリングしたり、データベースにアクセスしたり、外部APIにアクセスしたりすることができます。
from django.template import loader
from django.http import HttpResponse
from django.middleware.csrf import get_token
import json
from .models import Event
from .forms import EventForm
from .forms import CalendarForm
from django.http import JsonResponse
from django.http import Http404
import time
from django.template import loader
from django.http import HttpResponse
# Create your views here.


def index(request):
    """
    カレンダー画面
    """
    # CSRFのトークンを発行する
    get_token(request)
    # カレンダーを表示する画面を、テンプレートをレンダリングする
    template = loader.get_template("scheduleCalendar/index.html")
    return HttpResponse(template.render())


def add_event(request):
    """
    イベント登録
    """

    if request.method == "GET":
        # GETは対応しない
        raise Http404()

    # JSONの解析
    datas = json.loads(request.body)

    # バリデーション
    eventForm = EventForm(datas)
    if eventForm.is_valid() == False:
        # バリデーションエラー
        raise Http404()

    # リクエストの取得
    start_date = datas["start_date"]
    end_date = datas["end_date"]
    event_name = datas["event_name"]
    event_id = datas["event_id"]

    # 日付に変換。JavaScriptのタイムスタンプはミリ秒なので秒に変換
    formatted_start_date = time.strftime(
        "%Y-%m-%d", time.localtime(start_date / 1000))
    formatted_end_date = time.strftime(
        "%Y-%m-%d", time.localtime(end_date / 1000))

    # 登録処理
    event = Event(
        event_name=str(event_name),
        start_date=formatted_start_date,
        end_date=formatted_end_date,
        event_id=int(event_id),
    )
    event.save()

    # イベントIDを返却
    return JsonResponse({"event_id": int(event_id)})


def delete_event(request):
    """
    イベント削除
    """

    if request.method == "GET":
        # POST以外は対応しない
        raise Http404()

    # JSONの解析
    datas = json.loads(request.body)

    # イベントIDの取得
    event_id = datas.get("event_id")

    if not event_id or event_id is None:
        # event_idが空の場合、エラーレスポンスを返す
        return HttpResponse("event_id is missing or invalid")

    # イベントを検索し、削除する
    try:
        event = Event.objects.get(event_id=event_id)
        event.delete()
    except Event.DoesNotExist:
        # イベントが存在しない場合
        raise Http404()

    # 空を返却
    return HttpResponse("")

def get_events(request):
    """
    イベントの取得
    """

    if request.method == "GET":
        # GETは対応しない
        raise Http404()

    # JSONの解析
    datas = json.loads(request.body)

    # バリデーション
    calendarForm = CalendarForm(datas)
    if calendarForm.is_valid() == False:
        # バリデーションエラー
        raise Http404()

    # リクエストの取得
    start_date = datas["start_date"]
    end_date = datas["end_date"]

    # 日付に変換。JavaScriptのタイムスタンプはミリ秒なので秒に変換
    formatted_start_date = time.strftime(
        "%Y-%m-%d", time.localtime(start_date / 1000))
    formatted_end_date = time.strftime(
        "%Y-%m-%d", time.localtime(end_date / 1000))

    # FullCalendarの表示範囲のみ表示
    events = Event.objects.filter(
        start_date__lt=formatted_end_date, end_date__gt=formatted_start_date
    )

    # fullcalendarのため配列で返却
    list = []
    for event in events:
        list.append(
            {
                "title": event.event_name,
                "start": event.start_date,
                "end": event.end_date,
            }
        )

    return JsonResponse(list, safe=False)