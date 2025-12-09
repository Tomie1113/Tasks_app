
window.initScrollObserver = function () {
    const NAV_HEIGHT = 120;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                obs.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15, 
        rootMargin: `-${NAV_HEIGHT}px 0px -10% 0px`
    });

    document.querySelectorAll(".observe").forEach(el => {
        observer.observe(el); 
    });
};
