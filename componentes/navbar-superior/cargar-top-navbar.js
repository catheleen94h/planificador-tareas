
document.addEventListener('DOMContentLoaded', () => {
    const contenedorTop = document.getElementById('contenedor-top-navbar');
    if (contenedorTop) {
        fetch('../componentes/navbar-superior/navbar-top.html')
            .then(res => res.text())
            .then(html => {
                contenedorTop.innerHTML = html;
            })
            .catch(err => console.error('Error al cargar la barra superior:', err));
    }
});