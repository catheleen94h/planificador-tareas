document.addEventListener('DOMContentLoaded', () => {
    const contenedor = document.getElementById('contenedor-navbar');

    if (contenedor) {
        // Busca navbar.html dentro de la misma carpeta "componentes"
        fetch('../componentes/navbar-lateral/navbar.html')
            .then(respuesta => {
                if (!respuesta.ok) {
                    throw new Error('No se pudo cargar la barra de navegación');
                }
                return respuesta.text();
            })
            .then(html => {
                contenedor.innerHTML = html;
            })
            .catch(error => console.error('Error al cargar el navbar:', error));
    }


  
    const activarItemMenu = () => {
        const itemsMenu = document.querySelectorAll(".item-menu");
        if (itemsMenu.length === 0) return; // Si aún no se cargó el HTML, salimos

        const rutaActual = window.location.pathname;

        itemsMenu.forEach(item => {
            const hrefItem = item.getAttribute("href");

            // Limpiamos cualquier estado previo
            item.classList.remove("activo");

            // Comparamos si la ruta actual coincide con el enlace del menú
            if (hrefItem && hrefItem !== "#") {
                // Si estamos en la página de index / planificación
                if (rutaActual.includes("index") && hrefItem.includes("index")) {
                    item.classList.add("activo");
                } 
                else if (rutaActual.endsWith(hrefItem) || rutaActual.includes(hrefItem)) {
                    item.classList.add("activo");} }

          
            item.addEventListener("click", (e) => {
                if (hrefItem === "#") {
                    e.preventDefault(); 
                }
                itemsMenu.forEach(nav => nav.classList.remove("activo"));
                item.classList.add("activo");
            });
        });
    };

    
    activarItemMenu();
    setTimeout(activarItemMenu, 300);




});




