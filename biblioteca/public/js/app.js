// ============================================================
//  BiblioGestion — Frontend JavaScript
//  Conecta todas las páginas con la API REST del backend
// ============================================================

// ==================== UTILIDADES ====================

const API = '';  // Mismo origen

function getToken() {
    return localStorage.getItem('token');
}

function getUsuario() {
    const data = localStorage.getItem('usuario');
    return data ? JSON.parse(data) : null;
}

function guardarSesion(token, usuario) {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
}

function cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '/index.html';
}

// Fetch con Authorization header
async function fetchAuth(url, opciones = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(opciones.headers || {})
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return fetch(API + url, { ...opciones, headers });
}

// Toast notifications
function mostrarToast(mensaje, tipo = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const iconos = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${tipo}`;
    toast.innerHTML = `
        <span class="toast-icon">${iconos[tipo] || iconos.info}</span>
        <span>${mensaje}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('toast-exit');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// Modal helpers
function abrirModal(id) {
    document.getElementById(id).classList.add('active');
}

function cerrarModal(id) {
    document.getElementById(id).classList.remove('active');
}

// Formatear fecha
function formatFecha(fecha) {
    if (!fecha) return '—';
    return new Date(fecha).toLocaleDateString('es-PE', {
        year: 'numeric', month: 'short', day: 'numeric'
    });
}

// Badge de estado
function badgeEstado(estado) {
    const clases = {
        pendiente: 'badge-warning',
        prestado: 'badge-info',
        devuelto: 'badge-success'
    };
    const textos = {
        pendiente: 'Pendiente',
        prestado: 'Prestado',
        devuelto: 'Devuelto'
    };
    return `<span class="badge ${clases[estado] || 'badge-info'}">${textos[estado] || estado}</span>`;
}

// Badge de rol
function badgeRol(rol) {
    if (rol === 'admin') return '<span class="badge badge-purple">Admin</span>';
    return '<span class="badge badge-info">Usuario</span>';
}

// Mostrar auth message
function mostrarAuthMessage(mensaje, tipo = 'error') {
    const el = document.getElementById('authMessage');
    if (!el) return;
    el.textContent = mensaje;
    el.className = `auth-message ${tipo}`;
}

function limpiarAuthMessage() {
    const el = document.getElementById('authMessage');
    if (!el) return;
    el.textContent = '';
    el.className = 'auth-message';
}

// Setup navbar con datos de usuario
function setupNavbar() {
    const usuario = getUsuario();
    if (!usuario) return;

    const avatar = document.getElementById('userAvatar');
    const nombre = document.getElementById('userName');

    if (avatar) avatar.textContent = usuario.nombre ? usuario.nombre.charAt(0).toUpperCase() : '?';
    if (nombre) nombre.textContent = usuario.nombre || usuario.email;
}

// Proteger ruta
function protegerRuta(requiereAdmin = false) {
    const token = getToken();
    const usuario = getUsuario();

    if (!token || !usuario) {
        window.location.href = '/index.html';
        return false;
    }

    if (requiereAdmin && usuario.rol !== 'admin') {
        window.location.href = '/libros.html';
        return false;
    }

    return true;
}

// Hacer cerrarModal global (usado por onclick en HTML)
window.cerrarModal = cerrarModal;


// ==================== INICIALIZACIÓN POR PÁGINA ====================

document.addEventListener('DOMContentLoaded', () => {
    const pagina = window.location.pathname.split('/').pop() || 'index.html';

    // Logout button (presente en varias páginas)
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', cerrarSesion);
    }

    // Cerrar modales con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
        }
    });

    // Cerrar modal al clic fuera
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.classList.remove('active');
        });
    });

    // Router
    switch (pagina) {
        case 'index.html':
        case '':
            initLogin();
            break;
        case 'register.html':
            initRegister();
            break;
        case 'libros.html':
            initCatalogo();
            break;
        case 'prestamos.html':
            initMisPrestamos();
            break;
        case 'admin.html':
            initAdmin();
            break;
    }
});


// ==================== AUTH: LOGIN ====================

function initLogin() {
    // Si ya tiene sesión, redirigir
    const usuario = getUsuario();
    const token = getToken();
    if (token && usuario) {
        window.location.href = usuario.rol === 'admin' ? 'admin.html' : 'libros.html';
        return;
    }

    const form = document.getElementById('loginForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        limpiarAuthMessage();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        if (!email || !password) {
            mostrarAuthMessage('Por favor completa todos los campos');
            return;
        }

        const btn = document.getElementById('btnLogin');
        btn.disabled = true;
        btn.innerHTML = '<span class="loading-spinner"></span> Ingresando...';

        try {
            const res = await fetch(API + '/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                mostrarAuthMessage(data.mensaje || data.error || 'Error al iniciar sesión');
                return;
            }

            guardarSesion(data.token, data.usuario);
            
            // Redirigir según rol
            if (data.usuario.rol === 'admin') {
                window.location.href = '/admin.html';
            } else {
                window.location.href = '/libros.html';
            }

        } catch (error) {
            console.error(error);
            mostrarAuthMessage('Error de conexión con el servidor');
        } finally {
            btn.disabled = false;
            btn.textContent = 'Iniciar Sesión';
        }
    });
}


// ==================== AUTH: REGISTRO ====================

function initRegister() {
    const form = document.getElementById('registerForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        limpiarAuthMessage();

        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        if (!nombre || !email || !password) {
            mostrarAuthMessage('Por favor completa todos los campos');
            return;
        }

        if (password.length < 6) {
            mostrarAuthMessage('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        const btn = document.getElementById('btnRegister');
        btn.disabled = true;
        btn.innerHTML = '<span class="loading-spinner"></span> Registrando...';

        try {
            const res = await fetch(API + '/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                mostrarAuthMessage(data.mensaje || data.error || 'Error al registrar');
                return;
            }

            mostrarAuthMessage('¡Cuenta creada exitosamente! Redirigiendo...', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);

        } catch (error) {
            console.error(error);
            mostrarAuthMessage('Error de conexión con el servidor');
        } finally {
            btn.disabled = false;
            btn.textContent = 'Crear Cuenta';
        }
    });
}


// ==================== CATÁLOGO (Usuario) ====================

function initCatalogo() {
    if (!protegerRuta()) return;
    setupNavbar();

    cargarCatalogo();

    // Buscar
    const btnBuscar = document.getElementById('btnBuscar');
    const inputBuscar = document.getElementById('inputBuscar');
    const btnLimpiar = document.getElementById('btnLimpiar');

    if (btnBuscar) {
        btnBuscar.addEventListener('click', () => {
            cargarCatalogo(inputBuscar.value.trim());
        });
    }

    if (inputBuscar) {
        inputBuscar.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                cargarCatalogo(inputBuscar.value.trim());
            }
        });
    }

    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', () => {
            if (inputBuscar) inputBuscar.value = '';
            cargarCatalogo();
        });
    }
}

async function cargarCatalogo(busqueda = '') {
    const grid = document.getElementById('librosGrid');
    const vacio = document.getElementById('estadoVacio');
    if (!grid) return;

    grid.innerHTML = '<div class="table-empty"><span class="loading-spinner"></span><p style="margin-top:0.5rem">Cargando libros...</p></div>';

    try {
        const query = busqueda ? `?titulo=${encodeURIComponent(busqueda)}` : '';
        const res = await fetch(API + `/api/libros${query}`);
        const libros = await res.json();

        if (!libros.length) {
            grid.innerHTML = '';
            if (vacio) { vacio.classList.remove('hidden'); }
            return;
        }

        if (vacio) vacio.classList.add('hidden');

        grid.innerHTML = libros.map((libro, i) => `
            <div class="book-card" style="animation-delay: ${i * 0.05}s">
                <div class="book-card-icon">📖</div>
                <h4>${escapeHtml(libro.titulo)}</h4>
                <p class="book-author">✍️ ${escapeHtml(libro.autor)}</p>
                <div class="book-meta">
                    ${libro.categoria ? `<span>📂 ${escapeHtml(libro.categoria)}</span>` : ''}
                    <span>📦 ${libro.cantidad} disponible${libro.cantidad !== 1 ? 's' : ''}</span>
                </div>
                <div class="book-actions">
                    <button class="btn btn-primary btn-sm btn-block" 
                            onclick="solicitarPrestamo(${libro.id}, '${escapeHtml(libro.titulo)}')"
                            ${libro.cantidad < 1 ? 'disabled' : ''}>
                        ${libro.cantidad < 1 ? 'No disponible' : '📩 Solicitar Préstamo'}
                    </button>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error(error);
        grid.innerHTML = '<div class="table-empty"><p>❌ Error al cargar los libros</p></div>';
    }
}

// Solicitar préstamo (usuario)
window.solicitarPrestamo = async function(libroId, titulo) {
    if (!confirm(`¿Deseas solicitar el préstamo de "${titulo}"?`)) return;

    const usuario = getUsuario();
    if (!usuario) return;

    try {
        const res = await fetchAuth('/api/prestamos/create', {
            method: 'POST',
            body: JSON.stringify({
                usuario_id: usuario.id,
                libro_id: libroId
            })
        });

        const data = await res.json();

        if (!res.ok) {
            mostrarToast(data.error || 'Error al solicitar préstamo', 'error');
            return;
        }

        mostrarToast('¡Préstamo registrado exitosamente!', 'success');
        cargarCatalogo();

    } catch (error) {
        console.error(error);
        mostrarToast('Error de conexión', 'error');
    }
};


// ==================== MIS PRÉSTAMOS (Usuario) ====================

function initMisPrestamos() {
    if (!protegerRuta()) return;
    setupNavbar();
    cargarMisPrestamos();
}

async function cargarMisPrestamos() {
    const tabla = document.getElementById('tablaMisPrestamos');
    const statsDiv = document.getElementById('prestamosStats');
    const usuario = getUsuario();
    if (!tabla || !usuario) return;

    tabla.innerHTML = '<tr><td colspan="5" class="table-empty"><span class="loading-spinner"></span></td></tr>';

    try {
        // Cargar préstamos del usuario
        const res = await fetchAuth(`/api/prestamos/user/${usuario.id}`);
        const prestamos = await res.json();

        // Cargar libros para mostrar nombres
        const resLibros = await fetch(API + '/api/libros');
        const libros = await resLibros.json();
        const librosMap = {};
        libros.forEach(l => librosMap[l.id] = l.titulo);

        // Stats
        if (statsDiv) {
            const activos = prestamos.filter(p => p.estado === 'prestado').length;
            const devueltos = prestamos.filter(p => p.estado === 'devuelto').length;
            const pendientes = prestamos.filter(p => p.estado === 'pendiente').length;

            statsDiv.innerHTML = `
                <div class="stat-card">
                    <div class="stat-icon blue">📋</div>
                    <div class="stat-content">
                        <h3>${prestamos.length}</h3>
                        <p>Total Préstamos</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon purple">📖</div>
                    <div class="stat-content">
                        <h3>${activos}</h3>
                        <p>Activos</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green">✅</div>
                    <div class="stat-content">
                        <h3>${devueltos}</h3>
                        <p>Devueltos</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon orange">⏳</div>
                    <div class="stat-content">
                        <h3>${pendientes}</h3>
                        <p>Pendientes</p>
                    </div>
                </div>
            `;
        }

        if (!prestamos.length) {
            tabla.innerHTML = `
                <tr><td colspan="5" class="table-empty">
                    <div class="table-empty-icon">📋</div>
                    <p>Aún no tienes préstamos. ¡Explora el <a href="libros.html">catálogo</a>!</p>
                </td></tr>`;
            return;
        }

        tabla.innerHTML = prestamos.map(p => `
            <tr>
                <td><strong>#${p.id}</strong></td>
                <td>${escapeHtml(librosMap[p.libro_id] || `Libro #${p.libro_id}`)}</td>
                <td>${formatFecha(p.fecha_prestamo)}</td>
                <td>${formatFecha(p.fecha_devolucion)}</td>
                <td>${badgeEstado(p.estado)}</td>
            </tr>
        `).join('');

    } catch (error) {
        console.error(error);
        tabla.innerHTML = '<tr><td colspan="5" class="table-empty"><p>❌ Error al cargar préstamos</p></td></tr>';
    }
}


// ==================== ADMIN PANEL ====================

// Datos cacheados para lookups
let cacheLibros = [];
let cacheUsuarios = [];

function initAdmin() {
    if (!protegerRuta(true)) return;
    setupNavbar();
    initAdminTabs();

    // Cargar datos iniciales
    cargarLibrosAdmin();
    cargarUsuariosAdmin();
    cargarPrestamosAdmin();
    cargarAdminStats();

    // Botones de crear
    document.getElementById('btnNuevoLibro')?.addEventListener('click', () => abrirModalLibro());
    document.getElementById('btnNuevoAdmin')?.addEventListener('click', () => abrirModalUsuario());
    document.getElementById('btnNuevoPrestamo')?.addEventListener('click', () => abrirModalPrestamo());

    // Guardar
    document.getElementById('btnGuardarLibro')?.addEventListener('click', guardarLibro);
    document.getElementById('btnGuardarUsuario')?.addEventListener('click', guardarUsuario);
    document.getElementById('btnGuardarPrestamo')?.addEventListener('click', guardarPrestamo);
}

function initAdminTabs() {
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.style.display = 'none');

            tab.classList.add('active');
            const target = document.getElementById(tab.dataset.tab);
            if (target) target.style.display = 'block';
        });
    });
}

// ---------- ADMIN STATS ----------

async function cargarAdminStats() {
    const statsDiv = document.getElementById('adminStats');
    if (!statsDiv) return;

    try {
        const [resLibros, resPrestamos, resUsuarios] = await Promise.all([
            fetch(API + '/api/libros'),
            fetchAuth('/api/prestamos/get-prestamos'),
            fetchAuth('/api/usuarios/get-users')
        ]);

        const libros = await resLibros.json();
        const prestamos = await resPrestamos.json();
        const usuarios = await resUsuarios.json();

        const activos = Array.isArray(prestamos) ? prestamos.filter(p => p.estado === 'prestado' || p.estado === 'pendiente').length : 0;

        statsDiv.innerHTML = `
            <div class="stat-card">
                <div class="stat-icon purple">📚</div>
                <div class="stat-content">
                    <h3>${Array.isArray(libros) ? libros.length : 0}</h3>
                    <p>Libros en catálogo</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon blue">👥</div>
                <div class="stat-content">
                    <h3>${Array.isArray(usuarios) ? usuarios.length : 0}</h3>
                    <p>Usuarios registrados</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon green">📋</div>
                <div class="stat-content">
                    <h3>${Array.isArray(prestamos) ? prestamos.length : 0}</h3>
                    <p>Préstamos totales</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon orange">⏳</div>
                <div class="stat-content">
                    <h3>${activos}</h3>
                    <p>Préstamos activos</p>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error stats:', error);
    }
}


// ---------- ADMIN: LIBROS ----------

async function cargarLibrosAdmin() {
    const tabla = document.getElementById('tablaLibrosAdmin');
    if (!tabla) return;

    tabla.innerHTML = '<tr><td colspan="6" class="table-empty"><span class="loading-spinner"></span></td></tr>';

    try {
        const res = await fetch(API + '/api/libros');
        const libros = await res.json();
        cacheLibros = libros;

        if (!libros.length) {
            tabla.innerHTML = '<tr><td colspan="6" class="table-empty"><p>No hay libros registrados</p></td></tr>';
            return;
        }

        tabla.innerHTML = libros.map(l => `
            <tr>
                <td><strong>${l.id}</strong></td>
                <td>${escapeHtml(l.titulo)}</td>
                <td>${escapeHtml(l.autor)}</td>
                <td>${l.categoria ? escapeHtml(l.categoria) : '<span class="text-muted">—</span>'}</td>
                <td>${l.cantidad}</td>
                <td>
                    <div class="actions-cell">
                        <button class="btn btn-warning btn-sm" onclick="abrirModalLibro(${l.id})">✏️</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarLibro(${l.id}, '${escapeHtml(l.titulo)}')">🗑️</button>
                    </div>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error(error);
        tabla.innerHTML = '<tr><td colspan="6" class="table-empty"><p>❌ Error al cargar libros</p></td></tr>';
    }
}

window.abrirModalLibro = function(id = null) {
    const titulo = document.getElementById('modalLibroTitulo');

    document.getElementById('libroId').value = '';
    document.getElementById('libroTitulo').value = '';
    document.getElementById('libroAutor').value = '';
    document.getElementById('libroCategoria').value = '';
    document.getElementById('libroCantidad').value = '1';

    if (id) {
        titulo.textContent = 'Editar Libro';
        const libro = cacheLibros.find(l => l.id === id);
        if (libro) {
            document.getElementById('libroId').value = libro.id;
            document.getElementById('libroTitulo').value = libro.titulo;
            document.getElementById('libroAutor').value = libro.autor;
            document.getElementById('libroCategoria').value = libro.categoria || '';
            document.getElementById('libroCantidad').value = libro.cantidad;
        }
    } else {
        titulo.textContent = 'Nuevo Libro';
    }

    abrirModal('modalLibro');
};

async function guardarLibro() {
    const id = document.getElementById('libroId').value;
    const datos = {
        titulo: document.getElementById('libroTitulo').value.trim(),
        autor: document.getElementById('libroAutor').value.trim(),
        categoria: document.getElementById('libroCategoria').value.trim(),
        cantidad: parseInt(document.getElementById('libroCantidad').value) || 1
    };

    if (!datos.titulo || !datos.autor) {
        mostrarToast('Título y autor son obligatorios', 'warning');
        return;
    }

    try {
        const url = id ? `/api/libros/${id}` : '/api/libros';
        const method = id ? 'PUT' : 'POST';

        const res = await fetchAuth(url, {
            method,
            body: JSON.stringify(datos)
        });

        if (!res.ok) {
            const err = await res.json();
            mostrarToast(err.error || err.mensaje || 'Error al guardar libro', 'error');
            return;
        }

        cerrarModal('modalLibro');
        mostrarToast(id ? 'Libro actualizado' : 'Libro creado exitosamente', 'success');
        cargarLibrosAdmin();
        cargarAdminStats();

    } catch (error) {
        console.error(error);
        mostrarToast('Error de conexión', 'error');
    }
}

window.eliminarLibro = async function(id, titulo) {
    if (!confirm(`¿Eliminar el libro "${titulo}"? Esta acción no se puede deshacer.`)) return;

    try {
        const res = await fetchAuth(`/api/libros/${id}`, { method: 'DELETE' });

        if (!res.ok) {
            const err = await res.json();
            mostrarToast(err.error || 'Error al eliminar', 'error');
            return;
        }

        mostrarToast('Libro eliminado', 'success');
        cargarLibrosAdmin();
        cargarAdminStats();

    } catch (error) {
        console.error(error);
        mostrarToast('Error de conexión', 'error');
    }
};


// ---------- ADMIN: USUARIOS ----------

async function cargarUsuariosAdmin() {
    const tabla = document.getElementById('tablaUsuarios');
    if (!tabla) return;

    tabla.innerHTML = '<tr><td colspan="5" class="table-empty"><span class="loading-spinner"></span></td></tr>';

    try {
        const res = await fetchAuth('/api/usuarios/get-users');
        if (!res.ok) {
            tabla.innerHTML = '<tr><td colspan="5" class="table-empty"><p>Error al cargar usuarios</p></td></tr>';
            return;
        }
        const usuarios = await res.json();
        cacheUsuarios = usuarios;

        if (!usuarios.length) {
            tabla.innerHTML = '<tr><td colspan="5" class="table-empty"><p>No hay usuarios</p></td></tr>';
            return;
        }

        tabla.innerHTML = usuarios.map(u => `
            <tr>
                <td><strong>${u.id}</strong></td>
                <td>${escapeHtml(u.nombre)}</td>
                <td>${escapeHtml(u.email)}</td>
                <td>${badgeRol(u.rol)}</td>
                <td>
                    <div class="actions-cell">
                        <button class="btn btn-warning btn-sm" onclick="abrirModalUsuarioEditar(${u.id})">✏️</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarUsuario(${u.id}, '${escapeHtml(u.nombre)}')">🗑️</button>
                    </div>
                </td>
            </tr>
        `).join('');

    } catch (error) {
        console.error(error);
        tabla.innerHTML = '<tr><td colspan="5" class="table-empty"><p>❌ Error al cargar usuarios</p></td></tr>';
    }
}

window.abrirModalUsuario = function() {
    document.getElementById('modalUsuarioTitulo').textContent = 'Nuevo Administrador';
    document.getElementById('usuarioEditId').value = '';
    document.getElementById('usuarioNombre').value = '';
    document.getElementById('usuarioEmail').value = '';
    document.getElementById('usuarioPassword').value = '';
    document.getElementById('grupoPassword').style.display = 'block';
    document.getElementById('grupoRol').style.display = 'none';
    document.getElementById('usuarioPassword').required = true;
    abrirModal('modalUsuario');
};

window.abrirModalUsuarioEditar = function(id) {
    const u = cacheUsuarios.find(u => u.id === id);
    if (!u) return;

    document.getElementById('modalUsuarioTitulo').textContent = 'Editar Usuario';
    document.getElementById('usuarioEditId').value = u.id;
    document.getElementById('usuarioNombre').value = u.nombre;
    document.getElementById('usuarioEmail').value = u.email;
    document.getElementById('usuarioPassword').value = '';
    document.getElementById('grupoPassword').style.display = 'none';
    document.getElementById('grupoRol').style.display = 'block';
    document.getElementById('usuarioRol').value = u.rol;
    document.getElementById('usuarioPassword').required = false;
    abrirModal('modalUsuario');
};

async function guardarUsuario() {
    const id = document.getElementById('usuarioEditId').value;

    if (id) {
        // Editar usuario
        const datos = {
            nombre: document.getElementById('usuarioNombre').value.trim(),
            email: document.getElementById('usuarioEmail').value.trim(),
            rol: document.getElementById('usuarioRol').value
        };

        if (!datos.nombre || !datos.email) {
            mostrarToast('Nombre y correo son obligatorios', 'warning');
            return;
        }

        try {
            const res = await fetchAuth(`/api/usuarios/update-user/${id}`, {
                method: 'PUT',
                body: JSON.stringify(datos)
            });

            if (!res.ok) {
                const err = await res.json();
                mostrarToast(err.error || 'Error al actualizar', 'error');
                return;
            }

            cerrarModal('modalUsuario');
            mostrarToast('Usuario actualizado', 'success');
            cargarUsuariosAdmin();
            cargarAdminStats();

        } catch (error) {
            console.error(error);
            mostrarToast('Error de conexión', 'error');
        }
    } else {
        // Crear admin
        const datos = {
            nombre: document.getElementById('usuarioNombre').value.trim(),
            email: document.getElementById('usuarioEmail').value.trim(),
            password: document.getElementById('usuarioPassword').value
        };

        if (!datos.nombre || !datos.email || !datos.password) {
            mostrarToast('Todos los campos son obligatorios', 'warning');
            return;
        }

        try {
            const res = await fetchAuth('/api/usuarios/auth/add-admin', {
                method: 'POST',
                body: JSON.stringify(datos)
            });

            if (!res.ok) {
                const err = await res.json();
                mostrarToast(err.error || 'Error al crear admin', 'error');
                return;
            }

            cerrarModal('modalUsuario');
            mostrarToast('Administrador creado', 'success');
            cargarUsuariosAdmin();
            cargarAdminStats();

        } catch (error) {
            console.error(error);
            mostrarToast('Error de conexión', 'error');
        }
    }
}

window.eliminarUsuario = async function(id, nombre) {
    const usuario = getUsuario();
    if (usuario && usuario.id === id) {
        mostrarToast('No puedes eliminarte a ti mismo', 'warning');
        return;
    }

    if (!confirm(`¿Eliminar al usuario "${nombre}"? Se eliminarán también sus préstamos.`)) return;

    try {
        const res = await fetchAuth(`/api/usuarios/delete-user/${id}`, { method: 'DELETE' });

        if (!res.ok) {
            const err = await res.json();
            mostrarToast(err.error || 'Error al eliminar', 'error');
            return;
        }

        mostrarToast('Usuario eliminado', 'success');
        cargarUsuariosAdmin();
        cargarAdminStats();

    } catch (error) {
        console.error(error);
        mostrarToast('Error de conexión', 'error');
    }
};


// ---------- ADMIN: PRÉSTAMOS ----------

async function cargarPrestamosAdmin() {
    const tabla = document.getElementById('tablaPrestamosAdmin');
    if (!tabla) return;

    tabla.innerHTML = '<tr><td colspan="7" class="table-empty"><span class="loading-spinner"></span></td></tr>';

    try {
        const res = await fetchAuth('/api/prestamos/get-prestamos');
        if (!res.ok) {
            tabla.innerHTML = '<tr><td colspan="7" class="table-empty"><p>Error al cargar préstamos</p></td></tr>';
            return;
        }
        const prestamos = await res.json();

        // Mapas de nombres
        const librosMap = {};
        cacheLibros.forEach(l => librosMap[l.id] = l.titulo);
        const usuariosMap = {};
        cacheUsuarios.forEach(u => usuariosMap[u.id] = u.nombre);

        if (!prestamos.length) {
            tabla.innerHTML = '<tr><td colspan="7" class="table-empty"><p>No hay préstamos registrados</p></td></tr>';
            return;
        }

        tabla.innerHTML = prestamos.map(p => `
            <tr>
                <td><strong>#${p.id}</strong></td>
                <td>${escapeHtml(usuariosMap[p.usuario_id] || `#${p.usuario_id}`)}</td>
                <td>${escapeHtml(librosMap[p.libro_id] || `#${p.libro_id}`)}</td>
                <td>${formatFecha(p.fecha_prestamo)}</td>
                <td>${formatFecha(p.fecha_devolucion)}</td>
                <td>${badgeEstado(p.estado)}</td>
                <td>
                    ${p.estado !== 'devuelto' 
                        ? `<button class="btn btn-success btn-sm" onclick="devolverPrestamo(${p.id})">✅ Devolver</button>` 
                        : '<span class="text-muted text-sm">Completado</span>'}
                </td>
            </tr>
        `).join('');

    } catch (error) {
        console.error(error);
        tabla.innerHTML = '<tr><td colspan="7" class="table-empty"><p>❌ Error al cargar préstamos</p></td></tr>';
    }
}

window.devolverPrestamo = async function(id) {
    if (!confirm('¿Registrar la devolución de este préstamo?')) return;

    try {
        const res = await fetchAuth(`/api/prestamos/devolver/${id}`, { method: 'POST' });

        if (!res.ok) {
            const err = await res.json();
            mostrarToast(err.error || 'Error al devolver', 'error');
            return;
        }

        mostrarToast('Devolución registrada', 'success');
        cargarPrestamosAdmin();
        cargarAdminStats();

    } catch (error) {
        console.error(error);
        mostrarToast('Error de conexión', 'error');
    }
};

async function abrirModalPrestamo() {
    // Cargar selects
    const selectUsuario = document.getElementById('prestamoUsuario');
    const selectLibro = document.getElementById('prestamoLibro');

    // Usuarios
    try {
        const res = await fetchAuth('/api/usuarios/get-users');
        if (res.ok) {
            const usuarios = await res.json();
            selectUsuario.innerHTML = '<option value="">Seleccione un usuario</option>' +
                usuarios.map(u => `<option value="${u.id}">${escapeHtml(u.nombre)} (${escapeHtml(u.email)})</option>`).join('');
        }
    } catch (e) {
        console.error(e);
    }

    // Libros
    try {
        const res = await fetch(API + '/api/libros');
        const libros = await res.json();
        selectLibro.innerHTML = '<option value="">Seleccione un libro</option>' +
            libros.map(l => `<option value="${l.id}">${escapeHtml(l.titulo)} — ${escapeHtml(l.autor)}</option>`).join('');
    } catch (e) {
        console.error(e);
    }

    document.getElementById('prestamoFecha').value = '';
    abrirModal('modalPrestamo');
}

async function guardarPrestamo() {
    const usuario_id = document.getElementById('prestamoUsuario').value;
    const libro_id = document.getElementById('prestamoLibro').value;
    const fecha_devolucion = document.getElementById('prestamoFecha').value || null;

    if (!usuario_id || !libro_id) {
        mostrarToast('Selecciona usuario y libro', 'warning');
        return;
    }

    try {
        const res = await fetchAuth('/api/prestamos/create', {
            method: 'POST',
            body: JSON.stringify({
                usuario_id: Number(usuario_id),
                libro_id: Number(libro_id),
                fecha_devolucion
            })
        });

        const data = await res.json();

        if (!res.ok) {
            mostrarToast(data.error || 'Error al crear préstamo', 'error');
            return;
        }

        cerrarModal('modalPrestamo');
        mostrarToast('Préstamo creado exitosamente', 'success');
        cargarPrestamosAdmin();
        cargarAdminStats();

    } catch (error) {
        console.error(error);
        mostrarToast('Error de conexión', 'error');
    }
}


// ==================== UTILIDADES AUXILIARES ====================

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
