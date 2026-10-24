
   document.addEventListener('DOMContentLoaded', () => {
    const contenedorNavbar = document.getElementById('contenedor-navbar');
    if (!contenedorNavbar) return;

    // Función para actualizar los contadores del menú lateral
    const actualizarContadoresNavbar = () => {
        const tareas = JSON.parse(localStorage.getItem('listaTareas')) || [];
        
        const totalTareas = tareas.length;
        const tareasCompletadas = tareas.filter(t => t.estado && t.estado.toLowerCase() === 'finalizado').length;

        const ahora = new Date();
        const anio = ahora.getFullYear();
        const mes = String(ahora.getMonth() + 1).padStart(2, '0');
        const dia = String(ahora.getDate()).padStart(2, '0');
        const hoyLocal = `${anio}-${mes}-${dia}`;
        
        const tareasMiDia = tareas.filter(t => t.fechaDeEntrega && t.fechaDeEntrega.substring(0, 10) === hoyLocal).length;

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

    // Función para activar el ítem del menú según la página actual
    const activarItemMenu = () => {
        const itemsMenu = document.querySelectorAll(".item-menu");
        if (itemsMenu.length === 0) return;

        const rutaActual = window.location.pathname;

        itemsMenu.forEach(item => {
            const hrefItem = item.getAttribute("href");
            item.classList.remove("activo");

            if (hrefItem && hrefItem !== "#") {
                if (rutaActual.includes("index") && hrefItem.includes("index")) {
                    item.classList.add("activo");
                } else if (rutaActual.endsWith(hrefItem) || rutaActual.includes(hrefItem)) {
                    item.classList.add("activo");
                }
            }
            
            item.addEventListener("click", (e) => {
                if (hrefItem === "#") {
                    e.preventDefault(); 
                }
                itemsMenu.forEach(nav => nav.classList.remove("activo"));
                item.classList.add("activo");
            });
        });
    };

    // DETECCIÓN INTELIGENTE DE RUTA SEGÚN LA VISTA ACTUAL
    // Si estamos dentro de la carpeta /mi-dia/, subimos un nivel; de lo contrario entramos desde la raíz
    const rutaNavbar = window.location.pathname.includes('/mi-dia/') 
        ? '../navbar-lateral/navbar.html' 
        : './componentes/navbar-lateral/navbar.html';

    fetch(rutaNavbar)
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
            setTimeout(activarItemMenu, 200);
        })
        .catch(error => console.error('Error al cargar el navbar:', error));

    // Escuchar eventos globales de cambios en las tareas
    window.addEventListener('tareaAgregada', actualizarContadoresNavbar);
    window.addEventListener('storage', (e) => {
        if (e.key === 'listaTareas') {
            actualizarContadoresNavbar();
        }
    });

    setTimeout(actualizarContadoresNavbar, 300);
    setTimeout(actualizarContadoresNavbar, 800);
});