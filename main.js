function moverCaja() {
    var caja = document.getElementById("miCaja");
    var posX = document.getElementById("posicionX").value;
    var posY = document.getElementById("posicionY").value;
    caja.style.left = posX + "px";
    caja.style.top = posY + "px";
}

function cambiarEstilo() {
    var caja = document.getElementById("miCaja");
    var opacidad = document.getElementById("opacidad").value;
    var tamaño = document.getElementById("tamaño").value;
    var borde = document.getElementById("borde").value;
    var margen = document.getElementById("margen").value;
    var bordeRedondeado = document.getElementById("bordeRedondeado").value;
    
    caja.style.opacity = opacidad;
    caja.style.width = tamaño + "px";
    caja.style.height = tamaño + "px";
    caja.style.borderRadius = bordeRedondeado + "px";
    caja.style.border = borde + "px solid black";
    caja.style.margin = margen + "px";
}
function cambiarTamañoContenedor(valor) {
    var contenedor = document.getElementById("contenedor-regulado");
    contenedor.style.width = valor + "%";
}
