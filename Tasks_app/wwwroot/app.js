window.clickOutside = (element, dotnetHelper) => {
    document.addEventListener("click", function (e) {
        if (!element.contains(e.target)) {
            dotnetHelper.invokeMethodAsync("CloseTags");
        }
    });
};
