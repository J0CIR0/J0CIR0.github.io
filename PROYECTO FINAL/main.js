function confirmAge(isAdult) {
    if (isAdult) {
        window.location.href = "contenedores.html";
    } else {
        window.location.href = "underage.html";
    }
}
var Swiper = new Swiper(".mySwiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: "auto",
    loop: true,
    coverflowEffect: {
        depth: 500,
        modifier: 1,
        slideShadows: true,
        rotate: 0,
        stretch: 0
    }
})
function cargarHTML(url, container) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            container.innerHTML = data;
        });
}
var frames = document.querySelectorAll('.frame');
frames.forEach(frame => {
    var htmlURL = frame.getAttribute('data-html');
    cargarHTML(htmlURL, frame);
});