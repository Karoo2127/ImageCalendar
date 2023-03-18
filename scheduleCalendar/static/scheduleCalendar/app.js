// app.js: これはJavaScriptのファイルで、クライアントサイドでのロジックを実装するために使用されます。
// 主にユーザーの操作に応じてWebページを動的に更新するために使用されます。
//FullCalendarを制御するためのJavaScriptファイル

// CSRF対策
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"
axios.defaults.xsrfCookieName = "csrftoken"

function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

document.addEventListener('DOMContentLoaded', function () {

    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        locale: 'ja',
        aspectRatio:  2,
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: "dayGridMonth,listMonth",
            center: "title",
            right: "today prev,next"
        },
        buttonText: {
            today: '今日',
            month: '月',
            list: 'リスト'
        },
        dayCellContent: function(e) {
            e.dayNumberText = e.dayNumberText.replace('日', '');
        },
        selectable: true,


        // 日付をクリック、または範囲を選択したイベント
        select: function (info) {
            // 入力ダイアログ
            const eventName = prompt("イベントを入力してください");
            if (eventName) {
                // イベント追加した日時(YYYYMMDDHHMMSS)をevent_idとして使用
                const currentDateTime = getCurrentDateTime();
                // 登録処理の呼び出し
                axios
                    .post("/sc/add/", {
                        start_date: info.start.valueOf(),
                        end_date: info.end.valueOf(),
                        event_name: eventName,
                        event_id: currentDateTime,
                    })
                    .then((response) => {
                        // イベントの追加
                        calendar.addEvent({
                            title: eventName,
                            start: info.start,
                            end: info.end,
                            allDay: true,
                            event_id: response.data.event_id,
                        });
                    })
                    .catch(() => {
                        // バリデーションエラーなど
                        alert("登録に失敗しました");
                    });
            }
        },

        // イベントの削除
        eventClick: function (info) {
            if (confirm("イベントを削除しますか？")) {
                // イベント削除処理の呼び出し
                axios
                  .post("/sc/delete/", {
                    event_id: info.event.extendedProps.event_id,
                  })
                  .then(() => {
                    // イベントの削除
                    info.event.remove();
                  })
                  .catch(() => {
                    // エラー処理
                    alert("削除に失敗しました");
                  });
              }
        },

        events: function (info, successCallback, failureCallback) {
            axios
                .post("/sc/list/", {
                    start_date: info.start.valueOf(),
                    end_date: info.end.valueOf(),
                })
                .then((response) => {
                    calendar.removeAllEvents();
                    successCallback(response.data);
                })
                .catch(() => {
                    // バリデーションエラーなど
                    alert("登録に失敗しました");
                });          
        },    
    });

    calendar.render();
});