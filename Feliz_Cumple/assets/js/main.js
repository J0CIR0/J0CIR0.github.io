$(document).ready(function () {
    var fotoActiva = null;
    var temporizadorRegreso = null;
    var musicaActiva = false;
    var audioElement = document.getElementById('musicaFondo');

    function restaurarFotoPrincipal() {
        if (!fotoActiva) {
            return;
        }
        
        var $foto = fotoActiva;
        fotoActiva = null;
        
        $foto.removeClass('foto-activada');
        $('body').removeClass('foto-activa');
        
        if (temporizadorRegreso) {
            clearTimeout(temporizadorRegreso);
            temporizadorRegreso = null;
        }
        
        var $contenido = $foto.find('.polaroid-contenido');
        $contenido.css('animation', '');
        setTimeout(function() {
            $contenido.css('animation', '');
        }, 50);
    }

    function activarInteraccionFotos() {
        $('.marco-polaroid').off('click').on('click', function (evento) {
            evento.preventDefault();
            evento.stopPropagation();

            if ($(this).hasClass('foto-activada')) {
                return;
            }

            if (temporizadorRegreso) {
                clearTimeout(temporizadorRegreso);
                temporizadorRegreso = null;
            }

            restaurarFotoPrincipal();
            fotoActiva = $(this);
            $('body').addClass('foto-activa');
            fotoActiva.addClass('foto-activada');
            
            var $contenido = fotoActiva.find('.polaroid-contenido');
            $contenido.css('animation', 'mostrarDorso 5s ease forwards');
            $contenido.css('animation-delay', '2s');
            
            temporizadorRegreso = setTimeout(function () {
                restaurarFotoPrincipal();
                temporizadorRegreso = null;
            }, 7000);
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
            $('.contenedor-sobre').fadeOut(500);
            $('#tarjeta').addClass('entrada-activa');
            $('body').addClass('carta-abierta');
        });
    });
});