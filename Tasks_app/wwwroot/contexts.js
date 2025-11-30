let comp = null;

// Интероп для компонента контекстов. Повторяет логику для тегов, но с контекстами.
window.ContextsInterop = {

    // =====================
    //   ПОЛУЧЕНИЕ ССЫЛКИ НА КОМПОНЕНТ
    // =====================
    setComponent: function (instance) {
        comp = instance;
    },

    // =====================
    //   ПОДТВЕРЖДЕНИЕ УДАЛЕНИЯ
    // =====================
    confirmDelete: function (id) {

        const dialog = document.getElementById("context-delete-dialog");
        const yes = document.getElementById("context-del-yes");
        const no = document.getElementById("context-del-no");

        dialog.style.display = "flex";

        const close = () => dialog.style.display = "none";

        // Снимаем старые обработчики, чтобы не повторялись при повторных вызовах
        yes.replaceWith(yes.cloneNode(true));
        no.replaceWith(no.cloneNode(true));

        const yesNew = document.getElementById("context-del-yes");
        const noNew = document.getElementById("context-del-no");

        yesNew.addEventListener("click", () => {
            close();
            if (comp) comp.invokeMethodAsync("RequestContextDelete", id);
        });

        noNew.addEventListener("click", () => {
            close();
        });
    },

    // =====================
    //    ОБРАБОТКА СТРОК
    // =====================
    bindRowEvents: function (element, id) {

        // ПКМ → диалог удаления
        element.addEventListener("contextmenu", function (e) {
            e.preventDefault();
            window.ContextsInterop.confirmDelete(id);
        });

        // Долгое нажатие → диалог удаления (мобильные устройства)
        let pressTimer = null;
        element.addEventListener("touchstart", function () {
            pressTimer = setTimeout(() => {
                window.ContextsInterop.confirmDelete(id);
            }, 600);
        });
        element.addEventListener("touchend", () => clearTimeout(pressTimer));

        // Двойной клик → редактирование
        element.addEventListener("dblclick", function () {

            if (comp) comp.invokeMethodAsync("StartEdit");

            // Удаляем прошлый input (если есть)
            const old = element.querySelector("input");
            if (old)
                old.remove();

            const currentValue = element.innerText.trim();

            const input = document.createElement("input");
            input.value = currentValue;
            input.style.width = "100%";

            element.innerHTML = "";
            element.appendChild(input);
            input.focus();

            let renameSent = false;

            // Enter
            input.addEventListener("keydown", function (e) {
                if (e.key === "Enter" && !renameSent) {
                    renameSent = true;
                    const val = input.value.trim();
                    if (val.length === 0) return;
                    if (comp) comp.invokeMethodAsync("RequestContextRename", id, val);
                }
            });

            // Потеря фокуса
            input.addEventListener("blur", function () {
                if (!document.body.contains(input)) return;
                if (renameSent) return;
                renameSent = true;
                const val = input.value.trim();
                if (val.length === 0) return;
                if (comp) comp.invokeMethodAsync("RequestContextRename", id, val);
            });
        });
    },

    // =====================
    //   ПРИВЯЗКА К ID
    // =====================
    bindRowEventsById: function (id) {
        const el = document.getElementById(`context-${id}`);
        if (!el) return;
        window.ContextsInterop.bindRowEvents(el, id);
    }

};