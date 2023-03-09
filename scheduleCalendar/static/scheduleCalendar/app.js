//FullCalendarを制御するためのJavaScriptファイル

// CSRF対策
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"
axios.defaults.xsrfCookieName = "csrftoken"

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
        


        // 日付をクリック、または範囲を選択したイベント
        selectable: true,
        select: function (info) {

            // 入力ダイアログ
            const eventName = prompt("イベントを入力してください");

            if (eventName) {

                // 登録処理の呼び出し
                axios
                    .post("/sc/add/", {
                        start_date: info.start.valueOf(),
                        end_date: info.end.valueOf(),
                        event_name: eventName,
                    })
                    .then(() => {
                        // イベントの追加
                        calendar.addEvent({
                            title: eventName,
                            start: info.start,
                            end: info.end,
                            allDay: true,
                        });
                    })
                    .catch(() => {
                        // バリデーションエラーなど
                        alert("登録に失敗しました");
                    });
            }
        },

        // // イベントの削除
        // delete:("eventClick", function (info) {
        //     if (confirm("本当に削除しますか？")) {
        //     axios
        //         .delete("/sc/delete/" + info.event.id + "/")
        //         .then(() => {
        //             // イベントの削除
        //             info.event.remove();
        //         })
        //         .catch(() => {
        //             // エラー処理
        //             alert("削除に失敗しました");
        //         });
        //     }
        // }),

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