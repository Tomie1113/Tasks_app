let comp3 = null; // ссылка на Blazor-компонент задач

window.TasksInterop = {

    // =====================
    //  ПОЛУЧЕНИЕ ССЫЛКИ НА КОМПОНЕНТ C#
    // =====================
    setComponent: function (instance) {
        comp3 = instance; // сохраняем .NET-объект
        console.debug("[TasksInterop] Component attached:", instance); // отладочный лог
    },

    // =====================
    //  ДИАЛОГ ПОДТВЕРЖДЕНИЯ УДАЛЕНИЯ
    // =====================
    confirmDelete: function (id) {
        console.debug("[TasksInterop] confirmDelete called. id =", id); // лог вызова

        // Пытаемся сначала найти отдельный диалог для задач,
        // если его нет — используем общий (как у тегов)
        const dialog =
            document.getElementById("task-delete-dialog") // диалог для задач
            || document.getElementById("tag-delete-dialog"); // общий диалог, если используется один

        const yesBtn =
            document.getElementById("task-del-yes") // кнопка Да для задач
            || document.getElementById("tag-del-yes"); // fallback на кнопки тегов

        const noBtn =
            document.getElementById("task-del-no") // кнопка Нет для задач
            || document.getElementById("tag-del-no"); // fallback на кнопки тегов

        if (!dialog) { // если диалог вообще не найден
            console.warn("[TasksInterop] Delete dialog element not found"); // лог
            return; // выходим
        }

        dialog.style.display = "flex"; // показываем диалог

        const close = () => dialog.style.display = "none"; // функция закрытия

        if (!yesBtn || !noBtn) { // если нет кнопок, дальше смысла нет
            console.warn("[TasksInterop] Delete dialog buttons not found"); // лог
            return; // выходим
        }

        // Сбрасываем старые обработчики, чтобы клики не дублировались
        const yesNew = yesBtn.cloneNode(true); // новый элемент Да
        const noNew = noBtn.cloneNode(true);   // новый элемент Нет

        yesBtn.parentNode.replaceChild(yesNew, yesBtn); // подменяем старую кнопку Да
        noBtn.parentNode.replaceChild(noNew, noBtn);    // подменяем старую кнопку Нет

        // Подтверждение удаления
        yesNew.addEventListener("click", () => {
            console.debug("[TasksInterop] delete confirmed:", id); // лог
            close(); // закрываем диалог

            if (!comp3) { // если компонент не установлен
                console.error("[TasksInterop] comp3 is NULL on delete confirm"); // лог ошибки
                return; // выходим
            }

            comp3.invokeMethodAsync("RequestTaskDelete", id); // вызываем C#-метод удаления
        });

        // Отмена удаления
        noNew.addEventListener("click", () => {
            console.debug("[TasksInterop] delete canceled"); // лог отмены
            close(); // просто закрываем диалог
        });
    },

    // =====================
    // ПРИВЯЗКА ВСЕХ СОБЫТИЙ К СТРОКЕ
    // =====================
    bindRowEvents: function (element, id) {

        if (!element) { // если элемента нет
            console.warn("[TasksInterop] bindRowEvents: element is NULL for id =", id); // лог
            return; // выходим
        }

        // Чтобы не навешивать обработчики по нескольку раз — ставим флаг
        if (element.dataset.bound === "true") { // уже привязано
            console.debug("[TasksInterop] Row already bound, skipping:", id); // лог
            return; // выходим
        }

        element.dataset.bound = "true"; // помечаем, что обработчики уже навешаны
        console.debug("[TasksInterop] Binding events for row:", id); // лог

        // ПКМ → диалог удаления
        element.addEventListener("contextmenu", function (e) {
            e.preventDefault(); // отключаем стандартное меню
            console.debug("[TasksInterop] Right click on row:", id); // лог
            window.TasksInterop.confirmDelete(id); // показываем диалог удаления
        });

        // Двойной клик → редактирование задачи
        element.addEventListener("dblclick", function () {
            console.debug("[TasksInterop] Double click on row:", id); // лог
            if (!comp3) { // если компонент не установлен
                console.error("[TasksInterop] comp3 is NULL on dblclick"); // лог ошибки
                return; // выходим
            }
            comp3.invokeMethodAsync("RequestTaskEdit", id); // вызываем C#-метод редактирования
        });

        // Долгое нажатие для мобильных → диалог удаления
        let pressTimer = null; // таймер долгого нажатия

        element.addEventListener("touchstart", function () {
            pressTimer = setTimeout(() => { // запускаем таймер
                console.debug("[TasksInterop] Long touch on row:", id); // лог
                window.TasksInterop.confirmDelete(id); // показываем диалог удаления
            }, 600); // длительность долгого нажатия (мс)
        });

        element.addEventListener("touchend", function () {
            clearTimeout(pressTimer); // сбрасываем таймер при отпускании
        });

    },
    //// =====================
    //// НАЙТИ СТРОКУ ПО ID И ПОВЕСИТЬ СОБЫТИЯ
    //// =====================
    //bindRowEventsById: function (id) {
    //    const el = document.getElementById(`task-${id}`); // ищем td c id="task-<id>"

    //    if (!el) {
    //        console.warn("[TasksInterop] Row cell not found:", id); // для отладки
    //        return;
    //    }

    //    console.debug("[TasksInterop] Found row cell, binding:", id);
    //    window.TasksInterop.bindRowEvents(el, id); // навешиваем обработчики
    //}
    // =====================
    // НАЙТИ СТРОКУ ПО ID И ПОВЕСИТЬ СОБЫТИЯ
    // =====================
    bindRowEventsById: function (id) {
        const el = document.getElementById(`task-row-${id}`); // ищем ВСЮ строку

        if (!el) {
            console.warn("[TasksInterop] Row not found:", id);
            return;
        }

        console.debug("[TasksInterop] Found row, binding:", id);
        window.TasksInterop.bindRowEvents(el, id); // вешаем обработчики на <tr>
    }


};
