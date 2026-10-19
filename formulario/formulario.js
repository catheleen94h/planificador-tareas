// ==========================================
// CLASE TASKMANAGER
// ==========================================
class TaskManager {
    constructor() {
        this.tareas = JSON.parse(localStorage.getItem('listaTareas')) || [];
        this.idContador = parseInt(localStorage.getItem('idContador')) || 1;
    }

    addTask(taskData) {
        const nuevaTarea = {
            id: this.idContador++,
            nombre: taskData.nombre,
            descripcion: taskData.descripcion,
            asignadoA: taskData.asignadoA,
            fechaDeEntrega: taskData.fechaDeEntrega,
            estado: taskData.estado
        };

        this.tareas.push(nuevaTarea);
        this.sincronizarStorage();
        return nuevaTarea;
    }

    sincronizarStorage() {
        localStorage.setItem('listaTareas', JSON.stringify(this.tareas));
        localStorage.setItem('idContador', this.idContador);
    }
}

const gestorTareas = new TaskManager();

// ==========================================
// SELECCIÓN DE ELEMENTOS Y VALIDACIÓN
// ==========================================
const formularioTarea = document.getElementById('formulario-tarea');
const inputNombre = document.getElementById('tarea');
const inputDescripcion = document.getElementById('descripcion');
const inputAsignado = document.getElementById('asignadoA');
const inputFechaEntrega = document.getElementById('fechaEntrega');
const selectEstado = document.getElementById('estado');
const botonGuardar = document.getElementById('btn-guardar');

function mostrarError(elemento, mensaje) {
    let errorExistente = elemento.parentElement.querySelector('.mensaje-error');
    if (!errorExistente) {
        const small = document.createElement('small');
        small.className = 'mensaje-error';
        small.textContent = mensaje;
        elemento.parentElement.appendChild(small);
    } else {
        errorExistente.textContent = mensaje;
    }
    elemento.focus();
}

function limpiarError(elemento) {
    const errorExistente = elemento.parentElement.querySelector('.mensaje-error');
    if (errorExistente) {
        errorExistente.remove();
    }
}

function validateTaskForm() {
    let esValido = true;

    limpiarError(inputNombre);
    limpiarError(inputDescripcion);
    limpiarError(inputAsignado);
    limpiarError(inputFechaEntrega);
    limpiarError(selectEstado);

    // Regla Nombre: No en blanco y más largo que 8 caracteres
    const valorNombre = inputNombre.value.trim();
    if (valorNombre === '' || valorNombre.length <= 8) {
        mostrarError(inputNombre, 'El nombre no puede estar vacío y debe tener más de 8 caracteres.');
        esValido = false;
    }

    // Regla Descripción: No en blanco y más largo que 15 caracteres
    const valorDescripcion = inputDescripcion.value.trim();
    if (valorDescripcion === '' || valorDescripcion.length <= 15) {
        mostrarError(inputDescripcion, 'La descripción no puede estar vacía y debe tener más de 15 caracteres.');
        esValido = false;
    }

    // Regla AsignadoA: No en blanco y más largo que 8 caracteres
    const valorAsignado = inputAsignado.value.trim();
    if (valorAsignado === '' || valorAsignado.length <= 8) {
        mostrarError(inputAsignado, 'El responsable no puede estar vacío y debe tener más de 8 caracteres.');
        esValido = false;
    }

    // Regla Fecha de Entrega: No en blanco
    if (inputFechaEntrega.value === '') {
        mostrarError(inputFechaEntrega, 'Debes indicar una fecha de entrega.');
        esValido = false;
    }

    // Regla Estado: Debe tener un valor seleccionado
    if (selectEstado.value === '') {
        mostrarError(selectEstado, 'Debes seleccionar un estado para la tarea.');
        esValido = false;
    }

    return esValido;
}

// Limpieza de errores en tiempo real
inputNombre.addEventListener('input', () => limpiarError(inputNombre));
inputDescripcion.addEventListener('input', () => limpiarError(inputDescripcion));
inputAsignado.addEventListener('input', () => limpiarError(inputAsignado));
inputFechaEntrega.addEventListener('input', () => limpiarError(inputFechaEntrega));
selectEstado.addEventListener('change', () => limpiarError(selectEstado));

// Evento Guardar Tarea
botonGuardar.addEventListener('click', function(evento) {
    evento.preventDefault();

    if (!validateTaskForm()) {
        return; // Detiene si hay errores
    }

    const datosNuevaTarea = {
        nombre: inputNombre.value.trim(),
        descripcion: inputDescripcion.value.trim(),
        asignadoA: inputAsignado.value.trim(),
        fechaDeEntrega: inputFechaEntrega.value,
        estado: selectEstado.value
    };

    gestorTareas.addTask(datosNuevaTarea);

    alert('¡Tarea guardada con éxito!');
    formularioTarea.reset();

    
});