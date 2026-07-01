const listaCursos = document.getElementById("listaCursos");
const formInscripcion = document.getElementById("formInscripcion");

const nombre = document.getElementById("nombre");
const correo = document.getElementById("correo");
const telefono = document.getElementById("telefono");
const provincia = document.getElementById("provincia");
const curso = document.getElementById("curso");
const experiencia = document.getElementById("experiencia");
const fecha = document.getElementById("fecha");

const errorNombre = document.getElementById("errorNombre");
const errorCorreo = document.getElementById("errorCorreo");
const errorTelefono = document.getElementById("errorTelefono");
const errorProvincia = document.getElementById("errorProvincia");
const errorCurso = document.getElementById("errorCurso");
const errorExperiencia = document.getElementById("errorExperiencia");
const errorFecha = document.getElementById("errorFecha");

const mensajeFormulario = document.getElementById("mensajeFormulario");
const listaInscritos = document.getElementById("listaInscritos");
const btnBorrarTodo = document.getElementById("btnBorrarTodo");

const totalInscritos = document.getElementById("totalInscritos");
const cursoPopular = document.getElementById("cursoPopular");
const provinciaPopular = document.getElementById("provinciaPopular");

const btnInstituciones = document.getElementById("btnInstituciones");
const mensajeInstituciones = document.getElementById("mensajeInstituciones");
const mapaInstituciones = document.getElementById("mapaInstituciones");

let cursosDisponibles = [];
let inscritos = JSON.parse(localStorage.getItem("inscritosResQ")) || [];

cargarCursos();
mostrarInscritos();

function cargarCursos() {
    fetch("data/cursos.json")
        .then(function (respuesta) {
            return respuesta.json();
        })
        .then(function (datos) {
            cursosDisponibles = datos;
            mostrarCursosDisponibles();
            cargarOpcionesCursos();
        })
        .catch(function (error) {
            console.log(error);
            listaCursos.innerHTML = `
                <div class="sin-resultados">
                    <h3>No se pudieron cargar los cursos</h3>
                    <p>Revisa que el archivo data/cursos.json exista y esté bien escrito.</p>
                </div>
            `;
        });
}

function mostrarCursosDisponibles() {
    listaCursos.innerHTML = "";

    cursosDisponibles.forEach(function (cursoItem) {
        const tarjeta = document.createElement("article");
        tarjeta.className = "curso-card";

        tarjeta.innerHTML = `
            <img class="card-imagen" src="${cursoItem.imagen}" alt="Imagen de ${cursoItem.nombre}">

            <span class="curso-nivel">${cursoItem.nivel}</span>

            <h3>${cursoItem.nombre}</h3>

            <p>${cursoItem.descripcion}</p>

            <ul>
                <li><strong>Modalidad:</strong> ${cursoItem.modalidad}</li>
                <li><strong>Duración:</strong> ${cursoItem.duracion}</li>
                <li><strong>Institución:</strong> ${cursoItem.institucion}</li>
                <li><strong>Estado:</strong> ${cursoItem.estado}</li>
            </ul>

            <button class="btn-secondary" type="button">
                Me interesa
            </button>
        `;

        tarjeta.querySelector("button").addEventListener("click", function () {
            curso.value = cursoItem.nombre;
            formInscripcion.scrollIntoView({ behavior: "smooth" });
        });

        listaCursos.appendChild(tarjeta);
    });
}

function cargarOpcionesCursos() {
    curso.innerHTML = `<option value="">Seleccione un curso</option>`;

    cursosDisponibles.forEach(function (cursoItem) {
        const opcion = document.createElement("option");
        opcion.value = cursoItem.nombre;
        opcion.textContent = cursoItem.nombre;
        curso.appendChild(opcion);
    });
}

function validarNombre() {
    if (nombre.value.trim().length < 3) {
        errorNombre.textContent = "Ingrese un nombre válido.";
        return false;
    }

    errorNombre.textContent = "";
    return true;
}

function validarCorreo() {
    if (!correo.value.includes("@") || !correo.value.includes(".")) {
        errorCorreo.textContent = "Ingrese un correo válido.";
        return false;
    }

    errorCorreo.textContent = "";
    return true;
}

function validarTelefono() {
    if (telefono.value.trim().length < 8) {
        errorTelefono.textContent = "Ingrese un teléfono válido.";
        return false;
    }

    errorTelefono.textContent = "";
    return true;
}

function validarSelect(campo, error, mensaje) {
    if (campo.value === "") {
        error.textContent = mensaje;
        return false;
    }

    error.textContent = "";
    return true;
}

function validarFecha() {
    if (fecha.value === "") {
        errorFecha.textContent = "Seleccione una fecha disponible.";
        return false;
    }

    errorFecha.textContent = "";
    return true;
}

nombre.addEventListener("input", validarNombre);
correo.addEventListener("input", validarCorreo);
telefono.addEventListener("input", validarTelefono);

provincia.addEventListener("change", function () {
    validarSelect(provincia, errorProvincia, "Seleccione una provincia.");
});

curso.addEventListener("change", function () {
    validarSelect(curso, errorCurso, "Seleccione un curso.");
});

experiencia.addEventListener("change", function () {
    validarSelect(experiencia, errorExperiencia, "Seleccione su nivel de experiencia.");
});

fecha.addEventListener("change", validarFecha);

formInscripcion.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const formularioValido =
        validarNombre() &&
        validarCorreo() &&
        validarTelefono() &&
        validarSelect(provincia, errorProvincia, "Seleccione una provincia.") &&
        validarSelect(curso, errorCurso, "Seleccione un curso.") &&
        validarSelect(experiencia, errorExperiencia, "Seleccione su nivel de experiencia.") &&
        validarFecha();

    if (!formularioValido) {
        mensajeFormulario.textContent = "Revise los campos señalados antes de guardar.";
        mensajeFormulario.className = "mensaje mensaje-error";
        return;
    }

    const registro = {
        id: Date.now(),
        nombre: nombre.value.trim(),
        correo: correo.value.trim(),
        telefono: telefono.value.trim(),
        provincia: provincia.value,
        curso: curso.value,
        experiencia: experiencia.value,
        fecha: fecha.value
    };

    inscritos.push(registro);
    guardarLocalStorage();
    mostrarInscritos();

    mensajeFormulario.textContent = "Inscripción guardada correctamente.";
    mensajeFormulario.className = "mensaje mensaje-ok";

    formInscripcion.reset();
});

function guardarLocalStorage() {
    localStorage.setItem("inscritosResQ", JSON.stringify(inscritos));
}

function mostrarInscritos() {
    listaInscritos.innerHTML = "";

    actualizarResumen();

    if (inscritos.length === 0) {
        listaInscritos.innerHTML = `
            <div class="sin-resultados">
                <h3>No hay registros guardados</h3>
                <p>Cuando una persona complete el formulario, aparecerá aquí.</p>
            </div>
        `;
        return;
    }

    inscritos.forEach(function (persona) {
        const tarjeta = document.createElement("article");
        tarjeta.className = "registro-card";

        tarjeta.innerHTML = `
            <div>
                <span class="curso-nivel">${persona.provincia}</span>
                <h3>${persona.nombre}</h3>
                <p><strong>Curso:</strong> ${persona.curso}</p>
                <p><strong>Correo:</strong> ${persona.correo}</p>
                <p><strong>Teléfono:</strong> ${persona.telefono}</p>
                <p><strong>Experiencia:</strong> ${persona.experiencia}</p>
                <p><strong>Fecha disponible:</strong> ${persona.fecha}</p>
            </div>

            <button class="btn-secondary" type="button">
                Eliminar
            </button>
        `;

        tarjeta.querySelector("button").addEventListener("click", function () {
            eliminarInscrito(persona.id);
        });

        listaInscritos.appendChild(tarjeta);
    });
}

function eliminarInscrito(id) {
    inscritos = inscritos.filter(function (persona) {
        return persona.id !== id;
    });

    guardarLocalStorage();
    mostrarInscritos();

    mensajeFormulario.textContent = "Registro eliminado correctamente.";
    mensajeFormulario.className = "mensaje mensaje-ok";
}

btnBorrarTodo.addEventListener("click", function () {
    if (inscritos.length === 0) {
        mensajeFormulario.textContent = "No hay registros para eliminar.";
        mensajeFormulario.className = "mensaje mensaje-error";
        return;
    }

    inscritos = [];
    guardarLocalStorage();
    mostrarInscritos();

    mensajeFormulario.textContent = "Todos los registros fueron eliminados.";
    mensajeFormulario.className = "mensaje mensaje-ok";
});

function actualizarResumen() {
    totalInscritos.textContent = "Personas inscritas: " + inscritos.length;

    cursoPopular.textContent =
        "Curso más solicitado: " + obtenerMasRepetido(inscritos, "curso");

    provinciaPopular.textContent =
        "Provincia con mayor interés: " + obtenerMasRepetido(inscritos, "provincia");
}

function obtenerMasRepetido(lista, propiedad) {
    if (lista.length === 0) {
        return "-";
    }

    const conteo = {};

    lista.forEach(function (item) {
        const valor = item[propiedad];

        if (conteo[valor]) {
            conteo[valor]++;
        } else {
            conteo[valor] = 1;
        }
    });

    let mayor = "";
    let cantidadMayor = 0;

    for (let valor in conteo) {
        if (conteo[valor] > cantidadMayor) {
            mayor = valor;
            cantidadMayor = conteo[valor];
        }
    }

    return mayor;
}

btnInstituciones.addEventListener("click", function () {
    if (navigator.geolocation) {
        mensajeInstituciones.textContent = "Buscando instituciones cercanas...";

        navigator.geolocation.getCurrentPosition(
            function (posicion) {
                const latitud = posicion.coords.latitude;
                const longitud = posicion.coords.longitude;

                mapaInstituciones.src =
                    "https://www.google.com/maps?q=cruz+roja+ina+universidades+centros+de+capacitacion+primeros+auxilios&ll=" +
                    latitud +
                    "," +
                    longitud +
                    "&z=13&output=embed";

                mensajeInstituciones.textContent =
                    "Mostrando instituciones y centros de capacitación cercanos.";
            },
            function () {
                mensajeInstituciones.textContent =
                    "No fue posible obtener tu ubicación. Puedes revisar el mapa general.";
            }
        );
    } else {
        mensajeInstituciones.textContent =
            "Tu navegador no permite obtener ubicación.";
    }
});