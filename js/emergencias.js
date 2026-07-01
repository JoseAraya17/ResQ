const contenedorEmergencias = document.getElementById("contenedorEmergencias");
const detalleEmergencia = document.getElementById("detalleEmergencia");
const buscador = document.getElementById("busquedaEmergencia");
const filtroCategoria = document.getElementById("filtroCategoria");
const contadorResultados = document.getElementById("contadorResultados");
const btnLimpiar = document.getElementById("btnLimpiar");

const favoritosEmergencias = document.getElementById("favoritosEmergencias");
const btnLimpiarFavoritos = document.getElementById("btnLimpiarFavoritos");

let emergencias = [];
let favoritas = JSON.parse(localStorage.getItem("emergenciasGuardadasResQ")) || [];

fetch("data/emergencias.json")
    .then(function (respuesta) {
        return respuesta.json();
    })
    .then(function (datos) {
        emergencias = datos;
        mostrarEmergencias(emergencias);
        mostrarFavoritas();
    })
    .catch(function (error) {
        console.log(error);
        contenedorEmergencias.innerHTML =
            "<p>No fue posible cargar la información de emergencias.</p>";
    });

function obtenerIcono(categoria) {
    if (categoria === "Quemaduras") return "🔥";
    if (categoria === "Heridas") return "🩸";
    if (categoria === "Respiración") return "🫁";
    if (categoria === "Pérdida de conciencia") return "⚡";
    if (categoria === "Golpes y lesiones") return "🦴";
    if (categoria === "Reacciones") return "🐝";
    if (categoria === "Emergencia médica") return "❤️";
    if (categoria === "Temperatura corporal") return "🌡️";
    if (categoria === "Intoxicación") return "☠️";
    if (categoria === "Metabólica") return "🍬";
    return "➕";
}

function obtenerClaseEstado(estado) {
    if (estado === "Leve") return "estado-leve";
    if (estado === "Moderado") return "estado-moderado";
    if (estado === "Urgente") return "estado-urgente";
    if (estado === "Crítico") return "estado-critico";
    return "";
}

function crearLista(lista) {
    if (!lista || lista.length === 0) {
        return "<li>No hay información disponible.</li>";
    }

    return lista.map(function (item) {
        return "<li>" + item + "</li>";
    }).join("");
}

function estaGuardada(id) {
    return favoritas.some(function (item) {
        return item.id === id;
    });
}

function guardarFavorita(emergencia) {
    if (estaGuardada(emergencia.id)) {
        detalleEmergencia.innerHTML = `
            <div class="detalle-card">
                <h2>Esta emergencia ya está guardada</h2>
                <p>
                    La emergencia <strong>${emergencia.nombre}</strong> ya forma parte
                    de tu lista personal.
                </p>
            </div>
        `;
        return;
    }

    favoritas.push({
        id: emergencia.id,
        nombre: emergencia.nombre,
        categoria: emergencia.categoria,
        estado: emergencia.estado,
        descripcion: emergencia.descripcion,
        imagen: emergencia.imagen
    });

    localStorage.setItem("emergenciasGuardadasResQ", JSON.stringify(favoritas));

    mostrarFavoritas();
    mostrarEmergencias(filtrarListaActual());

    detalleEmergencia.innerHTML = `
        <div class="detalle-card">
            <h2>Emergencia guardada</h2>
            <p>
                La emergencia <strong>${emergencia.nombre}</strong> fue agregada
                correctamente a tu lista personal.
            </p>
        </div>
    `;
}

function eliminarFavorita(id) {
    favoritas = favoritas.filter(function (item) {
        return item.id !== id;
    });

    localStorage.setItem("emergenciasGuardadasResQ", JSON.stringify(favoritas));

    mostrarFavoritas();
    mostrarEmergencias(filtrarListaActual());
}

function mostrarFavoritas() {
    favoritosEmergencias.innerHTML = "";

    if (favoritas.length === 0) {
        favoritosEmergencias.innerHTML = `
            <div class="sin-resultados">
                <h3>No hay emergencias guardadas</h3>
                <p>
                    Guarda emergencias importantes para consultarlas más rápido después.
                </p>
            </div>
        `;
        return;
    }

    favoritas.forEach(function (emergencia) {
        const tarjeta = document.createElement("article");
        tarjeta.className = "emergencia-card";

        const icono = obtenerIcono(emergencia.categoria);
        const claseEstado = obtenerClaseEstado(emergencia.estado);

        tarjeta.innerHTML = `
            <img class="card-imagen" src="${emergencia.imagen}" alt="Imagen de ${emergencia.nombre}">

            <div class="emergencia-top">
                <span class="emergencia-icono">${icono}</span>
                <span class="estado ${claseEstado}">${emergencia.estado}</span>
            </div>

            <h3>${emergencia.nombre}</h3>

            <p class="categoria">${emergencia.categoria}</p>

            <p>${emergencia.descripcion}</p>

            <button class="btn-secondary btn-eliminar-favorita" type="button">
                Eliminar de guardadas
            </button>
        `;

        tarjeta.querySelector("button").addEventListener("click", function () {
            eliminarFavorita(emergencia.id);
        });

        favoritosEmergencias.appendChild(tarjeta);
    });
}

function mostrarEmergencias(lista) {
    contenedorEmergencias.innerHTML = "";

    contadorResultados.textContent =
        "Emergencias encontradas: " + lista.length;

    if (lista.length === 0) {
        contenedorEmergencias.innerHTML = `
            <div class="sin-resultados">
                <h3>No se encontraron emergencias</h3>
                <p>Intenta escribir otra palabra o cambiar la categoría seleccionada.</p>
            </div>
        `;
        return;
    }

    lista.forEach(function (emergencia) {
        const tarjeta = document.createElement("article");
        tarjeta.className = "emergencia-card";

        const icono = obtenerIcono(emergencia.categoria);
        const claseEstado = obtenerClaseEstado(emergencia.estado);

        const textoBoton = estaGuardada(emergencia.id)
            ? "Guardada"
            : "Guardar emergencia";

        const claseBoton = estaGuardada(emergencia.id)
            ? "btn-secondary"
            : "btn-primary";

        tarjeta.innerHTML = `
            <img class="card-imagen" src="${emergencia.imagen}" alt="Imagen de ${emergencia.nombre}">

            <div class="emergencia-top">
                <span class="emergencia-icono">${icono}</span>
                <span class="estado ${claseEstado}">${emergencia.estado}</span>
            </div>

            <h3>${emergencia.nombre}</h3>

            <p class="categoria">${emergencia.categoria}</p>

            <p>${emergencia.descripcion}</p>

            <button class="btn-primary btn-ver" type="button">
                Consultar procedimiento
            </button>

            <button class="${claseBoton} btn-guardar" type="button">
                ${textoBoton}
            </button>
        `;

        tarjeta.querySelector(".btn-ver").addEventListener("click", function () {
            mostrarDetalle(emergencia);
        });

        tarjeta.querySelector(".btn-guardar").addEventListener("click", function () {
            guardarFavorita(emergencia);
        });

        contenedorEmergencias.appendChild(tarjeta);
    });
}

function mostrarDetalle(emergencia) {
    const icono = obtenerIcono(emergencia.categoria);
    const claseEstado = obtenerClaseEstado(emergencia.estado);

    const sintomas = emergencia.sintomas || [];
    const queHacer = emergencia.que_hacer || emergencia.pasos || [];
    const queNoHacer = emergencia.que_no_hacer || [];
    const cuando911 =
        emergencia.cuando_llamar_911 ||
        "Llama al 911 si la situación representa riesgo para la vida o empeora rápidamente.";

    const video = emergencia.video || "";
    const fuente = emergencia.fuente || "Fuente de referencia pendiente.";
    const imagen = emergencia.imagen || "";

    detalleEmergencia.innerHTML = `
        <div class="ficha-header">
            <div class="ficha-icono">${icono}</div>

            <div>
                <p class="ficha-categoria">${emergencia.categoria}</p>
                <h2>${emergencia.nombre}</h2>
                <span class="estado ${claseEstado}">${emergencia.estado}</span>
            </div>
        </div>

        ${
            imagen !== ""
                ? `<img class="imagen-emergencia" src="${imagen}" alt="Imagen ilustrativa de ${emergencia.nombre}">`
                : ""
        }

        <p class="detalle-descripcion">
            ${emergencia.descripcion}
        </p>

        <div class="ficha-grid">
            <section class="ficha-bloque">
                <h3>Síntomas o señales</h3>
                <ul>
                    ${crearLista(sintomas)}
                </ul>
            </section>

            <section class="ficha-bloque bloque-accion">
                <h3>Qué hacer</h3>
                <ol>
                    ${crearLista(queHacer)}
                </ol>
            </section>
        </div>

        <div class="ficha-grid">
            <section class="ficha-bloque bloque-no">
                <h3>Qué no hacer</h3>
                <ul>
                    ${crearLista(queNoHacer)}
                </ul>
            </section>

            <section class="ficha-bloque bloque-911">
                <h3>Cuándo llamar al 911</h3>
                <p>${cuando911}</p>
            </section>
        </div>

        <section class="recurso-card">
            <h3>Recurso recomendado</h3>

            ${
                video !== ""
                    ? `<a class="btn-secondary" href="${video}" target="_blank">
                            Ver video explicativo
                       </a>`
                    : `<p>No hay video agregado para esta emergencia.</p>`
            }

            <p class="fuente-texto">
                <strong>Fuente:</strong> ${fuente}
            </p>
        </section>

        <p class="nota-educativa">
            Esta información es una guía educativa. Ante una emergencia real,
            solicita ayuda profesional.
        </p>
    `;

    detalleEmergencia.scrollIntoView({
        behavior: "smooth"
    });
}

function filtrarListaActual() {
    const texto = buscador.value.toLowerCase();
    const categoria = filtroCategoria.value;

    const resultado = emergencias.filter(function (emergencia) {
        const coincideNombre =
            emergencia.nombre.toLowerCase().includes(texto);

        const coincideCategoria =
            categoria === "Todas" ||
            emergencia.categoria === categoria;

        return coincideNombre && coincideCategoria;
    });

    return resultado;
}

function filtrar() {
    mostrarEmergencias(filtrarListaActual());
}

buscador.addEventListener("keyup", filtrar);
filtroCategoria.addEventListener("change", filtrar);

btnLimpiar.addEventListener("click", function () {
    buscador.value = "";
    filtroCategoria.value = "Todas";

    mostrarEmergencias(emergencias);

    detalleEmergencia.innerHTML = `
        <p>
            Selecciona una emergencia para ver síntomas, qué hacer, qué evitar,
            cuándo llamar al 911, videos y fuentes de referencia.
        </p>
    `;
});

btnLimpiarFavoritos.addEventListener("click", function () {
    if (favoritas.length === 0) {
        detalleEmergencia.innerHTML = `
            <div class="detalle-card">
                <h2>No hay emergencias guardadas</h2>
                <p>No existen elementos para eliminar.</p>
            </div>
        `;
        return;
    }

    favoritas = [];
    localStorage.setItem("emergenciasGuardadasResQ", JSON.stringify(favoritas));

    mostrarFavoritas();
    mostrarEmergencias(filtrarListaActual());

    detalleEmergencia.innerHTML = `
        <div class="detalle-card">
            <h2>Lista vaciada</h2>
            <p>Todas las emergencias guardadas fueron eliminadas correctamente.</p>
        </div>
    `;
});