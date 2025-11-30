window.TasksInterop = {

    component: null,

    // привязка компонента .NET
    setComponent: function (ref) {
        this.component = ref;
    },

    // привязка событий
    bindRowEventsById: function (id) {
        const cell = document.getElementById("task-name-" + id);
        if (!cell) return;

        // ПКМ → диалог удаления
        cell.addEventListener("contextmenu", e => {
            e.preventDefault();
            window.TasksInterop.confirmDelete(id);
        });

        // ЛКМ → переименовать
        cell.addEventListener("click", e => {
            let value = prompt("Новое имя:");
            if (value && window.TasksInterop.component) {
                window.TasksInterop.component.invokeMethodAsync(
                    "RequestTaskRename",
                    id,
                    value
                );
            }
        });
    },

    // подтверждение удаления
    confirmDelete: function (id) {
        const dlg = document.getElementById("task-delete-dialog");

        const yes = document.getElementById("task-del-yes");
        const no = document.getElementById("task-del-no");

        dlg.style.display = "flex";

        // перерисовываем кнопки чтобы очистить старые обработчики
        yes.replaceWith(yes.cloneNode(true));
        no.replaceWith(no.cloneNode(true));

        const yes2 = document.getElementById("task-del-yes");
        const no2 = document.getElementById("task-del-no");

        yes2.addEventListener("click", () => {
            dlg.style.display = "none";

            // вызов C# через component, а не через DotNet.invokeMethodAsync
            if (window.TasksInterop.component) {
                window.TasksInterop.component.invokeMethodAsync(
                    "RequestTaskDelete",
                    id
                );
            }
        });

        no2.addEventListener("click", () => {
            dlg.style.display = "none";
        });
    }
};
