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
});