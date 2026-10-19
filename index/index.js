class TaskManagerIndex {
    constructor() {
        this.tareas = JSON.parse(localStorage.getItem('listaTareas')) || [];
    }

    getAllTasks() {
        return this.tareas;
    }

    deleteTask(taskId) {
        this.tareas = this.tareas.filter(tarea => tarea.id !== taskId);
        localStorage.setItem('listaTareas', JSON.stringify(this.tareas));
    }
}

const gestorIndex = new TaskManagerIndex();

document.addEventListener('DOMContentLoaded', () => {
    const contenedorLista = document.getElementById('contenedor-lista-tareas');
    
    function renderizarTareas() {
        contenedorLista.innerHTML = '';
        const todasLasTareas = gestorIndex.getAllTasks();

        if (todasLasTareas.length === 0) {
            contenedorLista.innerHTML = '<p style="color: #666;">No hay tareas creadas todavía.</p>';
            return;
        }

        todasLasTareas.forEach(tarea => {
            const tarjetaDiv = document.createElement('div');
            tarjetaDiv.className = 'tarjeta-tarea-item';
            
            tarjetaDiv.style.border = "1px solid #d0d5dd";
            tarjetaDiv.style.borderRadius = "8px";
            tarjetaDiv.style.padding = "16px";
            tarjetaDiv.style.marginBottom = "16px";
            tarjetaDiv.style.backgroundColor = "#fff";

            tarjetaDiv.innerHTML = `
                <h4 style="margin-bottom: 8px; color: #111;">${tarea.nombre}</h4>
                <p><strong>Descripción:</strong> ${tarea.descripcion}</p>
                <p><strong>Asignado a:</strong> ${tarea.asignadoA}</p>
                <p><strong>Fecha de Entrega:</strong> ${tarea.fechaDeEntrega}</p>
                <p><strong>Estado:</strong> ${tarea.estado}</p>
                <button type="button" class="btn-eliminar" data-id="${tarea.id}" style="background-color: #d9534f; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; margin-top: 12px;">Eliminar</button>
            `;

            // Lógica del botón Eliminar (Tarea 4)
            const btnEliminar = tarjetaDiv.querySelector('.btn-eliminar');
            btnEliminar.addEventListener('click', () => {
                gestorIndex.deleteTask(tarea.id);
                renderizarTareas(); // Vuelve a pintar la lista actualizada
            });

            contenedorLista.appendChild(tarjetaDiv);
        });
    }

    renderizarTareas();
});