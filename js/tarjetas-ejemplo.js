// Datos de prueba iniciales (10 tareas de ejemplo)
const tareasInicialesEjemplo = [
    { id: 1, nombre: "Diseñar interfaz", descripcion: "Crear wireframes del panel principal", fechaDeEntrega: "2026-11-01", asignadoA: "Ana Gómez", estado: "finalizado" },
    { id: 2, nombre: "Revisar código CSS", descripcion: "Optimizar estilos y clases en español", fechaDeEntrega: "2026-11-02", asignadoA: "Carlos López", estado: "en proceso" },
    { id: 3, nombre: "Configurar base de datos", descripcion: "Migrar tablas iniciales a producción", fechaDeEntrega: "2026-11-05", asignadoA: "María Pérez", estado: "pendiente" },
    { id: 4, nombre: "Pruebas de usuario", descripcion: "Realizar test de usabilidad del formulario", fechaDeEntrega: "2026-11-06", asignadoA: "Juan Torres", estado: "en proceso" },
    { id: 5, nombre: "Redactar documentación", descripcion: "Escribir manual de uso para nuevos usuarios", fechaDeEntrega: "2026-11-08", asignadoA: "Laura Martínez", estado: "pendiente" },
    { id: 6, nombre: "Ajustar responsive", descripcion: "Verificar diseño en dispositivos móviles", fechaDeEntrega: "2026-11-10", asignadoA: "Ana Gómez", estado: "finalizado" },
    { id: 7, nombre: "Optimizar imágenes", descripcion: "Comprimir recursos gráficos de la web", fechaDeEntrega: "2026-11-12", asignadoA: "Carlos López", estado: "pendiente" },
    { id: 8, nombre: "Integrar API", descripcion: "Conectar endpoint de autenticación", fechaDeEntrega: "2026-11-15", asignadoA: "María Pérez", estado: "en proceso" },
    { id: 9, nombre: "Reunión de avance", descripcion: "Sincronizar tareas semanales con el equipo", fechaDeEntrega: "2026-11-18", asignadoA: "Juan Torres", estado: "finalizado" },
    { id: 10, nombre: "Despliegue final", descripcion: "Subir la aplicación al servidor final", fechaDeEntrega: "2026-11-20", asignadoA: "Laura Martínez", estado: "pendiente" }
];

// Función autoejecutable o de inicialización que verifica si el localStorage está vacío
document.addEventListener("DOMContentLoaded", () => {
    const tareasGuardadas = localStorage.getItem('listaTareas');
    
    // Si no hay tareas guardadas previamente, inyecta las 10 de ejemplo
    if (!tareasGuardadas) {
        localStorage.setItem('listaTareas', JSON.stringify(tareasInicialesEjemplo));
        console.log("Se han cargado las 10 tareas iniciales de ejemplo.");
    }
});