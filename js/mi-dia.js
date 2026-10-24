document.addEventListener("DOMContentLoaded", () => {
  // Cargar y renderizar las metas de hoy al iniciar
  renderizarMetasDeHoy();

  // Escuchar cuando se agreguen o modifiquen tareas desde otra vista
  window.addEventListener('storage', (e) => {
    if (e.key === 'listaTareas') {
      renderizarMetasDeHoy();
    }
  });

  window.addEventListener('tareaAgregada', () => {
    renderizarMetasDeHoy();
  });

  // Inicializar el temporizador Pomodoro
  inicializarTemporizador();
});

function renderizarMetasDeHoy() {
  const listaTareasContenedor = document.querySelector('.lista-tareas');
  if (!listaTareasContenedor) return;

  const tareasGuardadas = localStorage.getItem('listaTareas');
  
  if (!tareasGuardadas) {
    listaTareasContenedor.innerHTML = '<p style="padding: 16px; color: #666; font-size: 13px;">No hay tareas registradas.</p>';
    return;
  }

  let todasLasTareas = JSON.parse(tareasGuardadas);

  // 1. LIMPIEZA AUTOMÁTICA DE DUPLICADOS EN LOCALSTORAGE (Basado en el ID único)
  const mapaUnicos = new Map();
  todasLasTareas.forEach(tarea => {
    mapaUnicos.set(tarea.id, tarea);
  });
  todasLasTareas = Array.from(mapaUnicos.values());
  localStorage.setItem('listaTareas', JSON.stringify(todasLasTareas));

  // Fecha actual en formato YYYY-MM-DD local
  const fechaHoy = new Date();
  const anio = fechaHoy.getFullYear();
  const mes = String(fechaHoy.getMonth() + 1).padStart(2, '0');
  const dia = String(fechaHoy.getDate()).padStart(2, '0');
  const hoyStr = `${anio}-${mes}-${dia}`;

  // 2. FILTRAR ÚNICAMENTE LAS TAREAS DE HOY
  const tareasDeHoy = todasLasTareas.filter(tarea => {
    if (!tarea.fechaDeEntrega) return false;
    return tarea.fechaDeEntrega.substring(0, 10) === hoyStr;
  });

  if (tareasDeHoy.length === 0) {
    listaTareasContenedor.innerHTML = '<p style="padding: 16px; color: #666; font-size: 13px;">No hay tareas programadas para hoy.</p>';
    return;
  }

  // Limpiamos el contenedor antes de dibujar
  listaTareasContenedor.innerHTML = '';

  tareasDeHoy.forEach((tarea) => {
    const esFinalizado = tarea.estado && tarea.estado.toLowerCase() === 'finalizado';
    
    // Función auxiliar para asignar clases a los badges de estado
    const obtenerClaseBadge = (estado) => {
      const est = (estado || 'pendiente').toLowerCase();
      if (est === 'finalizado') return 'finalizado';
      if (est === 'en proceso' || est === 'en-proceso') return 'en-proceso';
      if (est === 'revision' || est === 'revisión') return 'revision';
      return 'pendiente';
    };

    let textoEstadoOriginal = tarea.estado || 'Pendiente';
    let claseBadge = obtenerClaseBadge(textoEstadoOriginal);

    const elementoTarea = document.createElement('div');
    elementoTarea.classList.add('elemento-tarea');

    elementoTarea.innerHTML = `
      <div class="izquierda-tarea">
        <input type="checkbox" class="casilla-tarea" ${esFinalizado ? 'checked' : ''} data-id="${tarea.id}">
        <div class="detalles-tarea">
          <h3>${tarea.nombre}</h3>
          <p>${tarea.descripcion}</p>
        </div>
      </div>
      <span class="badge-estado ${claseBadge}">${textoEstadoOriginal}</span>
    `;

    const checkbox = elementoTarea.querySelector('.casilla-tarea');
    const badgeEstado = elementoTarea.querySelector('.badge-estado');

    // Memoria para recordar el estado original antes de marcar como finalizado
    let estadoAnterior = esFinalizado ? 'Pendiente' : textoEstadoOriginal;

    if (!esFinalizado) {
      estadoAnterior = tarea.estado || 'Pendiente';
    }

    // Evento interactivo al hacer clic en el checkbox (chular/deschular)
    checkbox.addEventListener('change', () => {
      let tareasActuales = JSON.parse(localStorage.getItem('listaTareas')) || [];

      tareasActuales = tareasActuales.map(t => {
        if (t.id === tarea.id) {
          if (checkbox.checked) {
            if (t.estado.toLowerCase() !== 'finalizado') {
              estadoAnterior = t.estado;
            }
            t.estado = 'Finalizado';
          } else {
            // Al desmarcar, recupera el estado exacto que tenía guardado antes
            t.estado = estadoAnterior;
          }
        }
        return t;
      });

      // Actualizamos el localStorage
      localStorage.setItem('listaTareas', JSON.stringify(tareasActuales));

      // Refrescamos el texto y color del badge visualmente de inmediato
      const tareaModificada = tareasActuales.find(t => t.id === tarea.id);
      const nuevoTexto = tareaModificada ? tareaModificada.estado : 'Pendiente';
      
      badgeEstado.textContent = nuevoTexto;
      badgeEstado.className = `badge-estado ${obtenerClaseBadge(nuevoTexto)}`;
    });

    listaTareasContenedor.appendChild(elementoTarea);
  });
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
        alert("¡Tiempo de enfoque terminado!");
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