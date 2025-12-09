let comp3 = null;

window.TasksInterop = {
    // =====================
    //   ПОЛУЧЕНИЕ ССЫЛКИ НА КОМПОНЕНТ
    // =====================
    setComponent: function (instance) {
        comp3 = instance;
        console.log(instance);
    },

    // =====================
    //   ПОДТВЕРЖДЕНИЕ УДАЛЕНИЯ
    // =====================
    confirmDelete: function (id) {

        const dialog = document.getElementById("task-delete-dialog");
        const yes = document.getElementById("task-del-yes");
        const no = document.getElementById("task-del-no");

        dialog.style.display = "flex";

        const close = () => dialog.style.display = "none";

        // удаляем старые обработчики, чтобы не повторялись
        yes.replaceWith(yes.cloneNode(true));
        no.replaceWith(no.cloneNode(true));

        const yesNew = document.getElementById("task-del-yes");
        const noNew = document.getElementById("task-del-no");

        yesNew.addEventListener("click", () => {
            close();
            console.log(comp3);
            comp3.invokeMethodAsync("RequestTaskDelete", id);
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
            window.TasksInterop.confirmDelete(id);
        });

        // Долгое нажатие → диалог удаления
        let pressTimer = null;
        element.addEventListener("touchstart", function () {
            pressTimer = setTimeout(() => {
                window.TasksInterop.confirmDelete(id);
            }, 600);
        });
        element.addEventListener("touchend", () => clearTimeout(pressTimer));

        // Двойной клик → редактирование
        element.addEventListener("dblclick", function () {

            comp3.invokeMethodAsync("StartEdit");

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
                        comp3.invokeMethodAsync("JsLoadTasksAsync");
                        return;
                    }
                    element.innerHTML = val;

                    if (element.id.includes("name"))
                        type = "name";
                    if (element.id.includes("statement"))
                        type = "statement";
                    if (element.id.includes("solutionIdea"))
                        type = "solutionIdea";
                    if (element.id.includes("polygonUrl"))
                        type = "polygonUrl";
                    if (element.id.includes("isPreparedCf"))
                        type = "isPreparedCf";
                    if (element.id.includes("isPreparedYandex"))
                        type = "isPreparedYandex";
                    if (element.id.includes("difficulty"))
                        type = "difficulty";
                    if (element.id.includes("notes"))
                        type = "notes";
                    /*
                    if (element.id.includes("tag"))
                        type = "tag";
                    if (element.id.includes("contest"))
                        type = "contest";
                     */

                    comp3.invokeMethodAsync("RequestTaskRename", id, val, type);
                }
            });

            // Потеря фокуса
            input.addEventListener("blur", function () {

                if (!document.body.contains(input)) return;
                if (renameSent) return;

                renameSent = true;

                const val = input.value.trim();
                if (val.length === 0) return;

                comp3.invokeMethodAsync("RequestTaskRename", id, val);
            });

        });
    },

    bindRowEventsById: function (id) {
        const name = document.getElementById(`task-name-${id}`);
        const statement = document.getElementById(`task-statement-${id}`);
        const solutionIdea = document.getElementById(`task-solutionIdea-${id}`);
        const polygonUrl = document.getElementById(`task-polygonUrl-${id}`);
        const isPreparedCf = document.getElementById(`task-isPreparedCF-${id}`);
        const isPreparedYandex = document.getElementById(`task-isPreparedYandex-${id}`);
        const difficulty = document.getElementById(`task-difficulty-${id}`);
        const notes = document.getElementById(`task-notes-${id}`);
        const tag = document.getElementById(`task-tag-${id}`);
        const contest = document.getElementById(`task-contest--${id}`);
        if (name)
            window.TasksInterop.bindRowEvents(name, id);
        if (statement)
            window.TasksInterop.bindRowEvents(statement, id);
        if (solutionIdea)
            window.TasksInterop.bindRowEvents(solutionIdea, id);
        if (polygonUrl)
            window.TasksInterop.bindRowEvents(polygonUrl, id);
        if (isPreparedCf)
            window.TasksInterop.bindRowEvents(isPreparedCf, id);
        if (isPreparedYandex)
            window.TasksInterop.bindRowEvents(isPreparedYandex, id);
        if (difficulty)
            window.TasksInterop.bindRowEvents(difficulty, id);
        if (notes)
            window.TasksInterop.bindRowEvents(notes, id);
        if (tag)
            window.TasksInterop.bindRowEvents(tag, id);
        if (contest)
            window.TasksInterop.bindRowEvents(contest, id);
    }
};
