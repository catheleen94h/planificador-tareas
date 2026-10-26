
   document.addEventListener('DOMContentLoaded', () => {
    const contenedorNavbar = document.getElementById('contenedor-navbar');
    if (!contenedorNavbar) return;

    // Actualiza los contadores del menú lateral
    const actualizarContadoresNavbar = () => {
        const tareas = JSON.parse(localStorage.getItem('listaTareas')) || [];

        const totalTareas = tareas.length;
        const tareasCompletadas = tareas.filter(
            t => t.estado && t.estado.toLowerCase() === 'finalizado'
        ).length;

        const ahora = new Date();
        const anio = ahora.getFullYear();
        const mes = String(ahora.getMonth() + 1).padStart(2, '0');
        const dia = String(ahora.getDate()).padStart(2, '0');
        const hoyLocal = `${anio}-${mes}-${dia}`;

       const manuales = JSON.parse(localStorage.getItem('metasManuales')) || [];

        const tareasMiDia = tareas.filter(t =>
         (t.fechaDeEntrega && t.fechaDeEntrega.substring(0, 10) === hoyLocal) ||
        manuales.includes(t.id)
            ).length;

        const itemsMenu = document.querySelectorAll('.item-menu, .item-menu-estatico');

        itemsMenu.forEach(item => {
            const spanTexto = item.querySelector('.texto-item');
            const spanContador = item.querySelector('.contador');

            if (spanTexto && spanContador) {
                const texto = spanTexto.textContent.trim().toLowerCase();

                if (texto.includes('mi día')) {
                    spanContador.textContent = tareasMiDia;
                } else if (texto.includes('todas las tareas')) {
                    spanContador.textContent = totalTareas;
                } else if (texto.includes('completadas')) {
                    spanContador.textContent = tareasCompletadas;
                }
            }
        });
    };

    // Marca como activo el ítem que corresponde a la página actual
    const activarItemMenu = () => {
        const itemsMenu = document.querySelectorAll('.item-menu');
        if (itemsMenu.length === 0) return;

        const rutaActual = window.location.pathname;
        const esInicio = rutaActual === '/' || rutaActual.endsWith('index.html');

        itemsMenu.forEach(item => {
            const hrefItem = item.getAttribute('href');
            item.classList.remove('activo');

            if (hrefItem && hrefItem !== '#') {
                if (hrefItem.includes('index')) {
                    if (esInicio) item.classList.add('activo');
                } else if (rutaActual.endsWith(hrefItem)) {
                    item.classList.add('activo');
                }
            }

            item.addEventListener('click', (e) => {
                if (hrefItem === '#') {
                    e.preventDefault();
                }
                itemsMenu.forEach(nav => nav.classList.remove('activo'));
                item.classList.add('activo');
            });
        });
    };

    // Carga la navbar
    fetch('componentes/navbar.html')
        .then(respuesta => {
            if (!respuesta.ok) {
                throw new Error('No se pudo cargar la barra de navegación');
            }
            return respuesta.text();
        })
        .then(html => {
            contenedorNavbar.innerHTML = html;
            actualizarContadoresNavbar();
            activarItemMenu();
        })
        .catch(error => console.error('Error al cargar el navbar:', error));

    // Escucha cambios en las tareas
    window.addEventListener('tareaAgregada', actualizarContadoresNavbar);
    window.addEventListener('storage', (e) => {
    if (e.key === 'listaTareas' || e.key === 'metasManuales') {
        actualizarContadoresNavbar();
    }
    });
});

