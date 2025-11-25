// wwwroot/js/scrollAnim.js

window.initScrollObserver = function () {
    const NAV_HEIGHT = 120; // высота шапки + отступы

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible"); // добавляем класс
                obs.unobserve(entry.target); // больше не трогаем этот элемент
            }
        });
    }, {
        threshold: 0.15,                    // сколько элемента должно быть видно
        rootMargin: `-${NAV_HEIGHT}px 0px -10% 0px` // учитываем фикс-меню
    });

    document.querySelectorAll(".observe").forEach(el => {
        observer.observe(el);               // навешиваем на все элементы
    });
};
