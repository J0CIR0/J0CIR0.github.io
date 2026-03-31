$(document).ready(function () {
    var fotoActiva = null;
    var temporizadorFoto = null;
    var musicaActiva = false;
    var audioElement = document.getElementById('musicaFondo');

    function restaurarFotoPrincipal() {
        if (!fotoActiva) {
            return;
        }
        fotoActiva.removeClass('foto-enfocada');
        $('body').removeClass('foto-activa');
        fotoActiva = null;
        if (temporizadorFoto) {
            clearTimeout(temporizadorFoto);
            temporizadorFoto = null;
        }
    }

    function activarInteraccionFotos() {
        $('.marco-polaroid').off('click').on('click', function (evento) {
            evento.preventDefault();
            evento.stopPropagation();

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
            }, 1000);
        });
    }

    function iniciarMusica() {
        if (audioElement && !musicaActiva) {
            audioElement.play().then(function() {
                musicaActiva = true;
                $('#botonMusica').addClass('activo');
                $('#botonMusica i').removeClass('fa-music').addClass('fa-pause');
                $('#botonMusica').html('<i class="fas fa-pause"></i> Pausar Música');
            }).catch(function(error) {
                console.log("Error al reproducir audio:", error);
            });
        } else if (audioElement && musicaActiva) {
            audioElement.pause();
            musicaActiva = false;
            $('#botonMusica').removeClass('activo');
            $('#botonMusica i').removeClass('fa-pause').addClass('fa-music');
            $('#botonMusica').html('<i class="fas fa-music"></i> Activar Música');
        }
    }

    $('#botonMusica').click(function(e) {
        e.stopPropagation();
        iniciarMusica();
    });

    activarInteraccionFotos();

    $('.dia-cumpleanos').click(function () {
        $('.sobre').css({ 'animation': 'caida 3s linear 1', '-webkit-animation': 'caida 3s linear 1' });
        $('.sobre').fadeOut(800, function () {
            $('.dia-cumpleanos .texto, .dia-cumpleanos .frente, .dia-cumpleanos .confeti').hide();
            $('#tarjeta').addClass('entrada-activa');
            $('body').addClass('carta-abierta');
        });
    });
});