let comp2 = null;

window.ContestsInterop = {
    
    // =====================
    //   ПОЛУЧЕНИЕ ССЫЛКИ НА КОМПОНЕНТ
    // =====================
    setComponent: function (instance) {
        comp2 = instance;
    },

    // =====================
    //   ПОДТВЕРЖДЕНИЕ УДАЛЕНИЯ
    // =====================
    confirmDelete: function (id) {

        const dialog = document.getElementById("contest-delete-dialog");
        const yes = document.getElementById("contest-del-yes");
        const no = document.getElementById("contest-del-no");

        dialog.style.display = "flex";

        const close = () => dialog.style.display = "none";

        // удаляем старые обработчики, чтобы не повторялись
        yes.replaceWith(yes.cloneNode(true));
        no.replaceWith(no.cloneNode(true));

        const yesNew = document.getElementById("contest-del-yes");
        const noNew = document.getElementById("contest-del-no");

        yesNew.addEventListener("click", () => {
            close();
            comp2.invokeMethodAsync("RequestContestDelete", id);
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
            window.ContestsInterop.confirmDelete(id);
        });

        // Долгое нажатие → диалог удаления
        let pressTimer = null;
        element.addEventListener("touchstart", function () {
            pressTimer = setTimeout(() => {
                window.ContestsInterop.confirmDelete(id);
            }, 600);
        });
        element.addEventListener("touchend", () => clearTimeout(pressTimer));

        // Двойной клик → редактирование
        element.addEventListener("dblclick", function () {
            
            comp2.invokeMethodAsync("StartEdit");

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
                let type =    "";
                if (e.key === "Enter" && !renameSent) {
                    renameSent = true;

                    const val = input.value.trim();
                    if (val.length === 0) {
                        comp2.invokeMethodAsync("JsLoadContestsAsync");
                        return;
                    }
                    element.innerHTML = val;

                    if (element.id.includes("name"))
                        type = "name";
                    if (element.id.includes("year"))
                        type = "year";

                    comp2.invokeMethodAsync("RequestContestRename", id, val, type);
                }
            });

            // Потеря фокуса
            input.addEventListener("blur", function () {

                if (!document.body.contains(input)) return;
                if (renameSent) return;

                renameSent = true;

                const val = input.value.trim();
                if (val.length === 0) return;

                comp2.invokeMethodAsync("RequestContestRename", id, val);
            });

        });
    },

    // =====================
    //   ПРИВЯЗКА К ID
    // =====================
    bindRowEventsById: function (id) {
        const name = document.getElementById(`contest-name-${id}`);
        const year = document.getElementById(`contest-year-${id}`);
        if (name)
            window.ContestsInterop.bindRowEvents(name, id);
        if (year)
            window.ContestsInterop.bindRowEvents(year, id);
    }

};