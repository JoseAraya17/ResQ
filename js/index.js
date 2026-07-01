const botonMensaje = document.getElementById("btnMensaje");
const mensajeInicio = document.getElementById("mensajeInicio");

const mensajes = [
    "Mantén la calma y verifica que el lugar sea seguro antes de ayudar.",
    "Llama al 9-1-1 si la situación representa un riesgo para la vida.",
    "No realices procedimientos para los que no has recibido capacitación.",
    "Tu seguridad siempre debe ser la prioridad antes de ayudar a otra persona.",
    "Los primeros auxilios buscan mantener con vida a la persona mientras llega la ayuda profesional.",
    "Evalúa siempre el entorno antes de acercarte a una víctima.",
    "Solicitar ayuda tempranamente puede marcar la diferencia durante una emergencia."
];

botonMensaje.addEventListener("click", function () {

    const numero = Math.floor(Math.random() * mensajes.length);

    mensajeInicio.textContent = mensajes[numero];

});

const btnUbicacion = document.getElementById("btnUbicacion");
const mensajeUbicacion = document.getElementById("mensajeUbicacion");
const mapaCentros = document.getElementById("mapaCentros");

btnUbicacion.addEventListener("click", function () {

    if (navigator.geolocation) {

        mensajeUbicacion.textContent = "Obteniendo ubicación...";

        navigator.geolocation.getCurrentPosition(

            function (posicion) {

                const latitud = posicion.coords.latitude;
                const longitud = posicion.coords.longitude;

                mapaCentros.src =
                    "https://www.google.com/maps?q=hospitales+cerca+de+mi&ll=" +
                    latitud +
                    "," +
                    longitud +
                    "&z=14&output=embed";

                mensajeUbicacion.textContent =
                    "Mostrando hospitales cercanos a tu ubicación aproximada.";

            },

            function () {

                mensajeUbicacion.textContent =
                    "No fue posible obtener tu ubicación. Revisa los permisos del navegador.";

            }

        );

    } else {

        mensajeUbicacion.textContent =
            "Tu navegador no permite obtener ubicación.";

    }

});

const contenedorEmergencias = document.getElementById("emergenciasInicio");

fetch("data/emergencias.json")

    .then(function (respuesta) {

        if (!respuesta.ok) {
            throw new Error("No se pudo leer el archivo JSON.");
        }

        return respuesta.json();

    })

    .then(function (datos) {

        contenedorEmergencias.innerHTML = "";

        const destacadas = datos.slice(0, 3);

        destacadas.forEach(function (emergencia) {

            const tarjeta = document.createElement("article");

            tarjeta.className = "emergencia-card";

            tarjeta.innerHTML = `

                <img
                    class="card-imagen"
                    src="${emergencia.imagen}"
                    alt="${emergencia.nombre}">

                <div class="card-contenido">

                    <span class="badge-categoria">
                        ${emergencia.categoria}
                    </span>

                    <h3>${emergencia.nombre}</h3>

                    <p>${emergencia.descripcion}</p>

                    <span class="badge-estado estado-${emergencia.estado.toLowerCase()}">
                        ${emergencia.estado}
                    </span>

                    <br><br>

                    <a href="emergencias.html" class="btn-primary">
                        Ver procedimiento
                    </a>

                </div>

            `;

            contenedorEmergencias.appendChild(tarjeta);

        });

    })

    .catch(function (error) {

        console.error(error);

        contenedorEmergencias.innerHTML = `

            <div class="sin-resultados">

                <h3>No fue posible cargar las emergencias.</h3>

                <p>
                    Verifique el archivo
                    <strong>data/emergencias.json</strong>.
                </p>

            </div>

        `;

    });