let comp = null;

window.TagsInterop = {

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

        const dialog = document.getElementById("tag-delete-dialog");
        const yes = document.getElementById("tag-del-yes");
        const no = document.getElementById("tag-del-no");

        dialog.style.display = "flex";

        const close = () => dialog.style.display = "none";

        // удаляем старые обработчики, чтобы не повторялись
        yes.replaceWith(yes.cloneNode(true));
        no.replaceWith(no.cloneNode(true));

        const yesNew = document.getElementById("tag-del-yes");
        const noNew = document.getElementById("tag-del-no");

        yesNew.addEventListener("click", () => {
            close();
            comp.invokeMethodAsync("RequestTagDelete", id);
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
            window.TagsInterop.confirmDelete(id);
        });

        // Долгое нажатие → диалог удаления
        let pressTimer = null;
        element.addEventListener("touchstart", function () {
            pressTimer = setTimeout(() => {
                window.TagsInterop.confirmDelete(id);
            }, 600);
        });
        element.addEventListener("touchend", () => clearTimeout(pressTimer));

        // Двойной клик → редактирование
        element.addEventListener("dblclick", function () {

            comp.invokeMethodAsync("StartEdit");

            // Удаляем прошлый input
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
                    
                    element.innerHTML = val;
                    
                    comp.invokeMethodAsync("RequestTagRename", id, val);
                }
            });

            // Потеря фокуса
            input.addEventListener("blur", function () {

                if (!document.body.contains(input)) return;
                if (renameSent) return;

                renameSent = true;

                const val = input.value.trim();
                if (val.length === 0) return;

                comp.invokeMethodAsync("RequestTagRename", id, val);
            });

        });
    },

    // =====================
    //   ПРИВЯЗКА К ID
    // =====================
    bindRowEventsById: function (id) {
        const el = document.getElementById(`tag-${id}`);
        if (!el) return;
        window.TagsInterop.bindRowEvents(el, id);
    }

};
