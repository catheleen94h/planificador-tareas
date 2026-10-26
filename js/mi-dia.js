document.addEventListener('DOMContentLoaded', () => {
    inicializarMetas();
    inicializarTemporizador();
});

// ==========================================
// METAS (tareas de hoy + agregadas manualmente)
// ==========================================
function inicializarMetas() {
    const selectTarea = document.getElementById('select-tarea');
    const btnAgregar = document.getElementById('btn-agregar-meta');
    const listaMetas = document.getElementById('lista-metas');
    if (!selectTarea || !btnAgregar || !listaMetas) return;

    const leerTareas = () => JSON.parse(localStorage.getItem('listaTareas')) || [];
    const guardarTareas = (tareas) => localStorage.setItem('listaTareas', JSON.stringify(tareas));
    const leerManuales = () => JSON.parse(localStorage.getItem('metasManuales')) || [];
    const guardarManuales = (ids) => localStorage.setItem('metasManuales', JSON.stringify(ids));

    const fechaHoy = () => {
        const ahora = new Date();
        const mes = String(ahora.getMonth() + 1).padStart(2, '0');
        const dia = String(ahora.getDate()).padStart(2, '0');
        return `${ahora.getFullYear()}-${mes}-${dia}`;
    };

    const esDeHoy = (t) =>
        t.fechaDeEntrega && t.fechaDeEntrega.substring(0, 10) === fechaHoy();

    const estaFinalizada = (t) =>
        (t.estado || '').toLowerCase() === 'finalizado';

    const claseBadge = (estado) => {
        const est = (estado || 'pendiente').toLowerCase();
        if (est === 'finalizado') return 'finalizado';
        if (est === 'en proceso' || est === 'en-proceso') return 'en-proceso';
        if (est === 'revision' || est === 'revisión') return 'revision';
        return 'pendiente';
    };

    const obtenerMetas = () => {
        const manuales = leerManuales();
        return leerTareas().filter(t => esDeHoy(t) || manuales.includes(t.id));
    };

    // El selector muestra solo tareas que NO son metas y NO están finalizadas
    const llenarSelector = () => {
        const idsMetas = obtenerMetas().map(t => t.id);
        selectTarea.innerHTML = '<option value="" disabled selected>Elige una tarea de tu lista</option>';

        leerTareas().forEach(t => {
            if (idsMetas.includes(t.id) || estaFinalizada(t)) return;
            const opcion = document.createElement('option');
            opcion.value = t.id;
            opcion.textContent = t.nombre;
            selectTarea.appendChild(opcion);
        });
    };

    const cambiarEstado = (id, marcado) => {
        const tareas = leerTareas().map(t => {
            if (t.id !== id) return t;

            const actual = t.estado || 'Pendiente';
            if (marcado) {
                if (actual.toLowerCase() !== 'finalizado') {
                    t.estadoAnterior = actual;
                }
                t.estado = 'Finalizado';
            } else {
                t.estado = t.estadoAnterior || 'Pendiente';
            }
            return t;
        });

        guardarTareas(tareas);
        window.dispatchEvent(new Event('tareaAgregada'));
    };

    // Quita una meta agregada manualmente (la tarea sigue existiendo en la lista)
    const quitarMeta = (id) => {
        guardarManuales(leerManuales().filter(m => m !== id));
        window.dispatchEvent(new Event('tareaAgregada'));
    };

    const renderMetas = () => {
        const metas = obtenerMetas();
        const manuales = leerManuales();
        listaMetas.innerHTML = '';

        if (metas.length === 0) {
            const vacio = document.createElement('p');
            vacio.textContent = 'Aún no tienes metas para hoy.';
            listaMetas.appendChild(vacio);
            return;
        }

        metas.forEach(meta => {
            const estadoTexto = meta.estado || 'Pendiente';

            const item = document.createElement('div');
            item.className = 'elemento-tarea';

            const izquierda = document.createElement('div');
            izquierda.className = 'izquierda-tarea';

            const check = document.createElement('input');
            check.type = 'checkbox';
            check.className = 'casilla-tarea';
            check.checked = estadoTexto.toLowerCase() === 'finalizado';
            check.addEventListener('change', () => cambiarEstado(meta.id, check.checked));

            const detalles = document.createElement('div');
            detalles.className = 'detalles-tarea';
            const titulo = document.createElement('h3');
            titulo.textContent = meta.nombre;
            const desc = document.createElement('p');
            desc.textContent = meta.descripcion || '';
            detalles.append(titulo, desc);

            izquierda.append(check, detalles);

            const derecha = document.createElement('div');
            derecha.className = 'derecha-tarea';

            const badge = document.createElement('span');
            badge.className = `badge-estado ${claseBadge(estadoTexto)}`;
            badge.textContent = estadoTexto;
            derecha.appendChild(badge);

            // Botón de quitar: solo para las agregadas a mano que no son de hoy
            if (manuales.includes(meta.id) && !esDeHoy(meta)) {
                const btnQuitar = document.createElement('button');
                btnQuitar.type = 'button';
                btnQuitar.className = 'btn-quitar-meta';
                btnQuitar.title = 'Quitar de mis metas';
                btnQuitar.textContent = '✕';
                btnQuitar.addEventListener('click', () => quitarMeta(meta.id));
                derecha.appendChild(btnQuitar);
            }

            item.append(izquierda, derecha);
            listaMetas.appendChild(item);
        });
    };

    const refrescar = () => {
        llenarSelector();
        renderMetas();
    };

    btnAgregar.addEventListener('click', () => {
        if (selectTarea.value === '') return;

        const id = Number(selectTarea.value);
        const manuales = leerManuales();
        if (!manuales.includes(id)) {
            manuales.push(id);
            guardarManuales(manuales);
        }
        window.dispatchEvent(new Event('tareaAgregada')); // refresca metas y contador del menú
    });

    window.addEventListener('storage', (e) => {
        if (e.key === 'listaTareas' || e.key === 'metasManuales') refrescar();
    });
    window.addEventListener('tareaAgregada', refrescar);

    refrescar();
}

// ==========================================
// TEMPORIZADOR (POMODORO)
// ==========================================
function inicializarTemporizador() {
    let temporizador;
    let segundosTotales = 25 * 60;
    let estaEnEjecucion = false;

    const pantalla = document.getElementById('pantalla-temporizador');
    const botonIniciar = document.getElementById('boton-iniciar');
    const botonPausar = document.getElementById('boton-pausar');
    const botonReiniciar = document.getElementById('boton-reiniciar');

    if (!pantalla) return;

    function actualizarPantalla() {
        const minutos = Math.floor(segundosTotales / 60);
        const segundos = segundosTotales % 60;
        pantalla.textContent = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
    }

    function iniciarTemporizador() {
        if (estaEnEjecucion) return;
        estaEnEjecucion = true;
        botonIniciar.classList.add('activo');
        botonPausar.classList.remove('activo');

        temporizador = setInterval(() => {
            if (segundosTotales > 0) {
                segundosTotales--;
                actualizarPantalla();
            } else {
                clearInterval(temporizador);
                estaEnEjecucion = false;
                alert('¡Tiempo de enfoque terminado!');
            }
        }, 1000);
    }

    function pausarTemporizador() {
        clearInterval(temporizador);
        estaEnEjecucion = false;
        botonIniciar.classList.remove('activo');
        botonPausar.classList.add('activo');
    }

    function reiniciarTemporizador() {
        clearInterval(temporizador);
        estaEnEjecucion = false;
        segundosTotales = 25 * 60;
        actualizarPantalla();
        botonIniciar.classList.remove('activo');
        botonPausar.classList.remove('activo');
    }

    if (botonIniciar) botonIniciar.addEventListener('click', iniciarTemporizador);
    if (botonPausar) botonPausar.addEventListener('click', pausarTemporizador);
    if (botonReiniciar) botonReiniciar.addEventListener('click', reiniciarTemporizador);
}