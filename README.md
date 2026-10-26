#  Planificador de Tareas

Aplicación web para organizar tareas y enfocarse en lo que importa cada día. Permite crear, editar y eliminar tareas, y ofrece una vista **"Mi día"** con metas diarias y un temporizador Pomodoro.

Está desarrollada con **HTML, CSS y JavaScript vanilla**, sin frameworks ni backend: todos los datos se guardan en el navegador con `localStorage`.

> *"Tu semana, con intención. Organiza lo que viene y dale espacio a lo que importa."*

---

## Funcionalidades

### Planificación (`index.html`)
- **Lista de tareas** en una tabla con nombre, descripción, fecha de entrega, responsable y estado.
- **Crear tareas** desde una ventana emergente (modal) con el botón **+ Nueva tarea**.
- **Editar y eliminar** tareas desde la columna de acciones.
- **Estados de la tarea:** Pendiente, En proceso, Revisión y Finalizado, con insignias de color.
- **Validación del formulario** con mensajes de error en pantalla:
  - Nombre: más de 8 caracteres.
  - Descripción: más de 15 caracteres.
  - Responsable: más de 8 caracteres.
  - Fecha de entrega y estado: obligatorios.
- **Datos de ejemplo:** si no hay tareas guardadas, se cargan 6 tareas de muestra para probar la aplicación.

### Mi día (`componentes/mi-dia.html`)
- **Metas del día:** muestra automáticamente las tareas cuya fecha de entrega es hoy.
- **Agregar metas manualmente** desde un selector con las tareas pendientes de la lista, y quitarlas cuando ya no se necesiten.
- **Marcar como finalizada** una meta con una casilla; al desmarcarla, la tarea vuelve a su estado anterior.
- **Temporizador Pomodoro** de 25 minutos con los controles Iniciar, Pausar y Reiniciar, y un campo para nombrar la tarea de enfoque.

### Navegación
- **Menú lateral** reutilizable (cargado como componente) con contadores en tiempo real de *Mi día*, *Todas las tareas* y *Completadas*.
- **Barra superior** con migas de pan.
- Los contadores se actualizan al instante al crear, editar o completar tareas, incluso entre pestañas abiertas.

---

## 🛠️ Tecnologías

| Tecnología | Uso |
|---|---|
| HTML5 | Estructura de las páginas y componentes |
| CSS3 | Estilos y diseño de la interfaz |
| JavaScript (ES6+) | Lógica, validación, componentes con `fetch` y clases |
| localStorage | Persistencia de datos en el navegador |

---

##  Estructura del proyecto

```
planificador-tareas/
├── index.html                  # Página principal: lista de tareas y formulario
├── componentes/
│   ├── mi-dia.html             # Vista "Mi día": metas y temporizador
│   ├── navbar.html             # Menú lateral
│   └── navbar-superior.html    # Barra superior
├── css/
│   ├── index.css
│   ├── mi-dia.css
│   ├── navbar-lateral.css
│   └── navbar-superior.css
└── js/
    ├── index.js                # Renderizado de la tabla, editar y eliminar
    ├── formulario.js           # TaskManager (CRUD) y validación del formulario
    ├── mi-dia.js               # Metas del día y temporizador Pomodoro
    ├── tarjetas-ejemplo.js     # Datos de ejemplo iniciales
    ├── cargar-lateral-navbar.js# Carga el menú lateral y actualiza contadores
    └── cargar-top-navbar.js    # Carga la barra superior
```

---

## 🚀 Cómo ejecutarlo

Como los componentes (menú lateral y barra superior) se cargan con `fetch`, el proyecto **debe abrirse desde un servidor local**; abrir `index.html` con doble clic (`file://`) no funcionará.

1. Clona el repositorio:
   ```bash
   git clone https://github.com/catheleen94h/planificador-tareas.git
   cd planificador-tareas
   ```
2. Inicia un servidor local con cualquiera de estas opciones:
   - **VS Code:** instala la extensión *Live Server* y haz clic en **Go Live**.
   - **Python:**
     ```bash
     python -m http.server 8000
     ```
   - **Node.js:**
     ```bash
     npx serve
     ```
3. Abre `http://localhost:8000` (o la dirección que indique tu servidor) en el navegador.

---

## 💾 Almacenamiento de datos

La información se guarda en el `localStorage` del navegador con estas claves:

| Clave | Contenido |
|---|---|
| `listaTareas` | Arreglo de tareas (`id`, `nombre`, `descripcion`, `asignadoA`, `fechaDeEntrega`, `estado`) |
| `idContador` | Siguiente identificador disponible para nuevas tareas |
| `metasManuales` | Identificadores de tareas agregadas manualmente a "Mi día" |

Para reiniciar la aplicación con los datos de ejemplo, borra estas claves desde las herramientas de desarrollo del navegador (*Application → Local Storage*) y recarga la página.

---

## 🗺️ Próximas mejoras

- [ ] Activar las vistas *Todas las tareas* y *Completadas* del menú lateral.
- [ ] Gestión de proyectos desde el menú lateral.
- [ ] Filtros y búsqueda en la lista de tareas.
- [ ] Notificación sonora al terminar el temporizador.
- [ ] Respaldo de datos en un backend o base de datos.

---

## 👩‍💻 Autora

**Diana Catherine Hinestroza Poveda**
- GitHub: [@catheleen94h](https://github.com/catheleen94h)
- LinkedIn: [diana-hinestroza](https://www.linkedin.com/in/diana-hinestroza)
