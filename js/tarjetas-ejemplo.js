// Datos de prueba iniciales (10 tareas de ejemplo)
const tareasInicialesEjemplo = [
    { id: 1, nombre: "Diseñar interfaz", descripcion: "Crear wireframes del panel principal", fechaDeEntrega: "2026-11-01", asignadoA: "Ana Gómez", estado: "finalizado" },
    { id: 2, nombre: "Revisar código CSS", descripcion: "Optimizar estilos y clases", fechaDeEntrega: "2026-11-02", asignadoA: "Carlos López", estado: "en proceso" },
    { id: 3, nombre: "Configurar base de datos", descripcion: "Migrar tablas iniciales a producción", fechaDeEntrega: "2026-11-05", asignadoA: "María Pérez", estado: "pendiente" },
    { id: 4, nombre: "Pruebas de usuario", descripcion: "Realizar test de usabilidad del formulario", fechaDeEntrega: "2026-11-06", asignadoA: "Juan Torres", estado: "en proceso" },
    { id: 5, nombre: "Redactar documentación", descripcion: "Escribir manual de uso para nuevos usuarios", fechaDeEntrega: "2026-11-08", asignadoA: "Laura Martínez", estado: "pendiente" },
    { id: 6, nombre: "Ajustar responsive", descripcion: "Verificar diseño en dispositivos móviles", fechaDeEntrega: "2026-11-10", asignadoA: "Ana Gómez", estado: "finalizado" },
    
];


document.addEventListener("DOMContentLoaded", () => {
    const tareasGuardadas = localStorage.getItem('listaTareas');
    
    // Convertimos lo recuperado a un Array (si no existe, asignamos un array vacío por defecto)
    const tareas = tareasGuardadas ? JSON.parse(tareasGuardadas) : [];

    // Si no existen tareas O el array está vacío ([]), cargamos las iniciales
    if (tareas.length === 0) {
        localStorage.setItem('listaTareas', JSON.stringify(tareasInicialesEjemplo));
        console.log("Se han cargado las 10 tareas iniciales de ejemplo.");
    }
});