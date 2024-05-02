const btn = document.getElementById('button');
const sectionAll = document.querySelectorAll('section[id]');
const inputName = document.querySelector('#nombre');
const inputEmail = document.querySelector('#email');
const textsToChange = document.querySelectorAll('[data-section]');
window.addEventListener('load', () => {
    const contenedorLoader = document.querySelector('.contenedor--loader');
    contenedorLoader.style.opacity = 0;
    contenedorLoader.style.visibility = 'hidden';
})
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    header.classList.toggle('abajo', window.scrollY > 0);
});
btn.addEventListener('click', function() {
    if (this.classList.contains('active')) {
        this.classList.remove('active');
        this.classList.add('not-active');
        document.querySelector('.nav_menu').classList.remove('active');
        document.querySelector('.nav_menu').classList.add('not-active');
    }
    else {
        this.classList.add('active');
        this.classList.remove('not-active');
        document.querySelector('.nav_menu').classList.remove('not-active');
        document.querySelector('.nav_menu').classList.add('active');
    }
});
window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sectionAll.forEach((current) => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 100;
        const sectionId = current.getAttribute('id');
        if (scrollY > sectionTop && scrollY < sectionTop + sectionHeight) {
            document.querySelector('nav a[href*=' + sectionId + ']').classList.add('active');
        }
        else {
            document.querySelector('nav a[href*=' + sectionId + ']').classList.remove('active');
        }
    });
});
window.onscroll = function() {
    if (document.documentElement.scrollTop > 100) {
        document.querySelector('.go-top-contenedor').classList.add('show');
    }
    else {
        document.querySelector('.go-top-contenedor').classList.remove('show');
    }
}
document.querySelector('.go-top-contenedor').addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

const $form = document.querySelector(`#form`);
const $successMessage = document.querySelector(`#success-message`);
$form.addEventListener(`submit`, handlesubmit);
async function handlesubmit(event) {
    event.preventDefault();
    const form = new FormData(this);
    const response = await fetch("https://formspree.io/f/xrgnrrnz", {
        method: "POST",
        body: form,
        headers: {
            'Accept': 'application/json'
        }
    });
    if (response.ok) {
        this.reset();
        $successMessage.style.display = 'block';
        setTimeout(() => {
            $successMessage.style.display = 'none';
        }, 5000);
    }
}
