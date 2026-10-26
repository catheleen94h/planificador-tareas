document.addEventListener('DOMContentLoaded', () => {
    const contenedorTop = document.getElementById('contenedor-top-navbar');
    if (!contenedorTop) return; 

    fetch('componentes/navbar-superior.html')
        .then(response => {
            if (!response.ok) throw new Error('No se encontró la navbar superior');
            return response.text();
        })
        .then(html => {
            contenedorTop.innerHTML = html;
        })
        .catch(error => console.error('Error al cargar la barra superior:', error));
});