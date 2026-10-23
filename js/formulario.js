// ==========================================
// CLASE TASKMANAGER
// ==========================================
class TaskManager {
    constructor() {
        this.idContador = parseInt(localStorage.getItem('idContador')) || 1;
    }

    addTask(taskData) {
        this.tareas = JSON.parse(localStorage.getItem('listaTareas')) || [];

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

    updateTask(taskData) {
        this.tareas = JSON.parse(localStorage.getItem('listaTareas')) || [];
        this.tareas = this.tareas.map(t => t.id === taskData.id ? taskData : t);
        this.sincronizarStorage();
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
const contenedorFormulario = document.getElementById("contenedor-formulario-modal");

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

    const valorNombre = inputNombre.value.trim();
    if (valorNombre === '' || valorNombre.length <= 8) {
        mostrarError(inputNombre, 'El nombre no puede estar vacío y debe tener más de 8 caracteres.');
        esValido = false; }

    const valorDescripcion = inputDescripcion.value.trim();
    if (valorDescripcion === '' || valorDescripcion.length <= 15) {
     mostrarError(inputDescripcion, 'La descripción no puede estar vacía y debe tener más de 15 caracteres.');
        esValido = false;  }

    const valorAsignado = inputAsignado.value.trim();
    if (valorAsignado === '' || valorAsignado.length <= 8) {
        mostrarError(inputAsignado, 'El responsable no puede estar vacío y debe tener más de 8 caracteres.');
          esValido = false;}

    if (inputFechaEntrega.value === '') {
        mostrarError(inputFechaEntrega, 'Debes indicar una fecha de entrega.');
         esValido = false;}

    if (selectEstado.value === '') {
        mostrarError(selectEstado, 'Debes seleccionar un estado para la tarea.');
         esValido = false;}

    return esValido;
}

inputNombre.addEventListener('input', () => limpiarError(inputNombre));
 inputDescripcion.addEventListener('input', () => limpiarError(inputDescripcion));
inputAsignado.addEventListener('input', () => limpiarError(inputAsignado));
inputFechaEntrega.addEventListener('input', () => limpiarError(inputFechaEntrega));
selectEstado.addEventListener('change', () => limpiarError(selectEstado));

// Guardar Tarea (Crear o Editar)
if (botonGuardar) {
    botonGuardar.addEventListener('click', function(evento) {
    evento.preventDefault();

         if (!validateTaskForm()) {return;}

        const idEnEdicion = formularioTarea.dataset.editandoId;

        const datosTarea = {
            id: idEnEdicion ? parseInt(idEnEdicion) : null,
            nombre: inputNombre.value.trim(),
            descripcion: inputDescripcion.value.trim(),
            asignadoA: inputAsignado.value.trim(),
            fechaDeEntrega: inputFechaEntrega.value,
            estado: selectEstado.value };

        if (idEnEdicion) {
            gestorTareas.updateTask(datosTarea);
            delete formularioTarea.dataset.editandoId;
        } else {
            delete datosTarea.id;
            gestorTareas.addTask(datosTarea); }

        if (contenedorFormulario) {
        contenedorFormulario.style.display = "none";
         }

        formularioTarea.reset();

        window.dispatchEvent(new Event('tareaAgregada'));
    });
}