$(document).ready(function () {
    var tiempoRegresoFoto = 6000;
    var fotoActiva = null;
    var temporizadorFoto = null;

    function restaurarFotoPrincipal() {
        if (!fotoActiva) {
            return;
        }

        fotoActiva.removeClass('foto-enfocada');
        $('body').removeClass('foto-activa');
        fotoActiva = null;
    }

    function activarInteraccionFotos() {
        $('.marco-polaroid').off('click').on('click', function (evento) {
            evento.preventDefault();

            if ($(this).hasClass('foto-enfocada')) {
                return;
            }

            if (temporizadorFoto) {
                clearTimeout(temporizadorFoto);
                temporizadorFoto = null;
            }

            restaurarFotoPrincipal();
            fotoActiva = $(this);
            $('body').addClass('foto-activa');
            fotoActiva.addClass('foto-enfocada');

            temporizadorFoto = setTimeout(function () {
                restaurarFotoPrincipal();
                temporizadorFoto = null;
            }, tiempoRegresoFoto);
        });
    }

    // Al cargar la página, ocultamos las cortinas
    $('.cortina-izquierda').css('width', '0%');
    $('.cortina-derecha').css('width', '0%');

    activarInteraccionFotos();

    $('.dia-san-valentin').click(function () {
        // Animación de desvanecimiento de los elementos del sobre
        $('.sobre').css({ 'animation': 'caida 3s linear 1', '-webkit-animation': 'caida 3s linear 1' });
        $('.sobre').fadeOut(800, function () {
            // Ocultar elementos dentro de .dia-san-valentin
            $('.dia-san-valentin .corazon, .dia-san-valentin .texto, .dia-san-valentin .frente').hide();

            // Hacer visible la carta con una animación de entrada más elaborada
            $('#tarjeta').addClass('entrada-activa');
            $('body').addClass('carta-abierta');
        });
    });
}); 
