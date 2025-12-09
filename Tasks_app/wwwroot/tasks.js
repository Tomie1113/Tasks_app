let comp3 = null;

window.TasksInterop = {

    //получение ссылки на компонент
    setComponent: function (instance) {
        comp3 = instance;
    },

    //подтверждение удаления
    confirmDelete: function (id) {
        const dialog =
            document.getElementById("task-delete-dialog")
            || document.getElementById("tag-delete-dialog"); 

        const yesBtn =
            document.getElementById("task-del-yes")
            || document.getElementById("tag-del-yes");

        const noBtn =
            document.getElementById("task-del-no")
            || document.getElementById("tag-del-no");

        if (!dialog) {
            return;
        }

        dialog.style.display = "flex";

        const close = () => dialog.style.display = "none";

        if (!yesBtn || !noBtn) {
            return;
        }
        
        const yesNew = yesBtn.cloneNode(true);
        const noNew = noBtn.cloneNode(true);

        yesBtn.parentNode.replaceChild(yesNew, yesBtn);
        noBtn.parentNode.replaceChild(noNew, noBtn);
        
        yesNew.addEventListener("click", () => {
            close();

            if (!comp3) {
                return;
            }

            comp3.invokeMethodAsync("RequestTaskDelete", id);
        });
        
        noNew.addEventListener("click", () => {
            close();
        });
    },
    
    //обработка строк
    bindRowEvents: function (element, id) {

        if (!element) {
            return;
        }
        
        if (element.dataset.bound === "true") {
            return;
        }
        element.dataset.bound = "true";
        //пкм
        element.addEventListener("contextmenu", function (e) {
            e.preventDefault();
            window.TasksInterop.confirmDelete(id);
        });

        //редактирование
        element.addEventListener("dblclick", function () {
            if (!comp3) {
                return;
            }
            comp3.invokeMethodAsync("RequestTaskEdit", id);
        });
        
        let pressTimer = null;
        element.addEventListener("touchstart", function () {
            pressTimer = setTimeout(() => {
                window.TasksInterop.confirmDelete(id);
            }, 600);
        });

        element.addEventListener("touchend", function () {
            clearTimeout(pressTimer);
        });

    },
    
    //привязка к id
    bindRowEventsById: function (id) {
        const el = document.getElementById(`task-row-${id}`);

        if (!el) {
            return;
        }
        window.TasksInterop.bindRowEvents(el, id);
    }


};
