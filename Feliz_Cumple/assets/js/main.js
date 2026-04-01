$(document).ready(function () {
    var fotoActiva = null;
    var temporizadorRegreso = null;
    var audioElement = document.getElementById('musicaFondo');
    var canciones = [
        "assets/sound/felizcumple.mpeg",
        "assets/sound/mividaentera.mpeg"
    ];
    var cancionActual = 0;

    function reproducirSiguienteCancion() {
        cancionActual++;
        if (cancionActual >= canciones.length) {
            cancionActual = 1;
        }
        audioElement.src = canciones[cancionActual];
        audioElement.load();
        audioElement.play().catch(function(error) {
            console.log("Error al reproducir audio:", error);
        });
    }

    function iniciarMusicaAutomatica() {
        if (audioElement) {
            audioElement.src = canciones[0];
            audioElement.load();
            audioElement.play().then(function() {
                console.log("Reproduciendo: felizcumple.mpeg");
            }).catch(function(error) {
                console.log("Error al reproducir audio automáticamente:", error);
                $(document).one('click', function() {
                    audioElement.play().catch(function(e) {
                        console.log("Error:", e);
                    });
                });
            });
        }
    }

    // Cuando termine una canción, pasar a la siguiente
    audioElement.addEventListener('ended', function() {
        reproducirSiguienteCancion();
    });

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
    iniciarMusicaAutomatica();
});