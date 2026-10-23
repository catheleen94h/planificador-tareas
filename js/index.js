document.addEventListener("DOMContentLoaded", () => {
    const btnNuevaTarea = document.getElementById("btn-nueva-tarea");
   const contenedorFormulario = document.getElementById("contenedor-formulario-modal");
    const btnCancelar = document.getElementById("btn-cancelar");
    const formulario = document.getElementById("formulario-tarea");

    // Mostrar ventana emergente 
    if (btnNuevaTarea) {
        btnNuevaTarea.addEventListener("click", () => {
            delete formulario.dataset.editandoId;
            formulario.reset();
            contenedorFormulario.style.display = "flex";
        });
    }

    // Ocultar ventana 
    if (btnCancelar) {
        btnCancelar.addEventListener("click", () => {
         contenedorFormulario.style.display = "none";
        formulario.reset();
            delete formulario.dataset.editandoId;});

     }
    });

// obtener y eliminar tareas d localStorage
const gestorIndex = {
    getAllTasks() {
        return JSON.parse(localStorage.getItem('listaTareas')) || [];},

     deleteTask(taskId) {
      let tareas = JSON.parse(localStorage.getItem('listaTareas')) || [];
        tareas = tareas.filter(tarea => tarea.id !== taskId);
        localStorage.setItem('listaTareas', JSON.stringify(tareas));}
};

document.addEventListener('DOMContentLoaded', () => {
    const contenedorLista = document.getElementById('contenedor-lista-tareas');
   const contenedorFormulario = document.getElementById("contenedor-formulario-modal");
    const inputNombre = document.getElementById('tarea');
    const inputDescripcion = document.getElementById('descripcion');
     const inputAsignado = document.getElementById('asignadoA');
    const inputFechaEntrega = document.getElementById('fechaEntrega');
    const selectEstado = document.getElementById('estado');
     const formulario = document.getElementById('formulario-tarea');
    
    // Función para convertir el estado de la tarea en una clase CSS válida
    const convertirClaseEstado = (estado) => {
        switch (estado.toLowerCase()) {
           case 'finalizado': return 'finalizado';
            case 'en proceso': return 'en-proceso';
            case 'pendiente': return 'pendiente';
            default: return 'pendiente'; } };

    function renderizarTareas() {
     contenedorLista.innerHTML = '';
        const todasLasTareas = gestorIndex.getAllTasks();

     if (todasLasTareas.length === 0) {
            contenedorLista.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; color: #666; padding: 20px;">No hay tareas creadas todavía.</td>
                </tr>
            `;
            return;}

        todasLasTareas.forEach(tarea => {
            const fila = document.createElement('tr');
            const claseEstado = convertirClaseEstado(tarea.estado);
            
            fila.innerHTML = `
                <td>${tarea.nombre}</td>
                <td><strong>${tarea.descripcion}</strong></td>
                <td>${tarea.fechaDeEntrega}</td>
                <td>${tarea.asignadoA}</td>
                <td><span class="badge-estado ${claseEstado}">${tarea.estado}</span></td>
                <td>
                <button type="button" class="btn-editar" data-id="${tarea.id}" title="Editar" style="background:none; border:none; cursor:pointer; margin-right: 8px;">✏️</button>
                <button type="button" class="btn-eliminar" data-id="${tarea.id}" title="Eliminar" style="background:none; border:none; cursor:pointer; color: #d9534f;">🗑️</button>
                </td>
            `;

            // Lógica del botón Editar
            const btnEditar = fila.querySelector('.btn-editar');
            btnEditar.addEventListener('click', () => {
              inputNombre.value = tarea.nombre;
                inputDescripcion.value = tarea.descripcion;
                inputAsignado.value = tarea.asignadoA;
                inputFechaEntrega.value = tarea.fechaDeEntrega;
                selectEstado.value = tarea.estado;

                formulario.dataset.editandoId = tarea.id;

                if (contenedorFormulario) {
                    contenedorFormulario.style.display = "flex";
                }
            });

            // Lógica del botón Eliminar
            const btnEliminar = fila.querySelector('.btn-eliminar');
            btnEliminar.addEventListener('click', () => {
                gestorIndex.deleteTask(tarea.id);
                renderizarTareas();
            });

            contenedorLista.appendChild(fila);
        });
    }

    renderizarTareas();

    window.addEventListener('tareaAgregada', () => {
        renderizarTareas();
    });
});