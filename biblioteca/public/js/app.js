document.addEventListener('DOMContentLoaded', () => {
    const pagina = window.location.pathname.split('/').pop();

    if (pagina === 'admin.html') {
        inicializarAdminTabs();
    }
});

function inicializarAdminTabs() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    if (!tabs.length || !tabContents.length) {
        return;
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(tc => tc.style.display = 'none');

            tab.classList.add('active');
            const tabId = tab.getAttribute('data-tab');
            const contenido = document.getElementById(tabId);
            if (contenido) {
                contenido.style.display = 'block';
            }
        });
    });
}



// Cliente simple para listar/crear/devolver préstamos.
const usuarioSelect = document.getElementById('usuarioSelect');
const libroSelect = document.getElementById('libroSelect');
const tablaPrestamos = document.getElementById('tablaPrestamos');
const formPrestamo = document.getElementById('formPrestamo');

async function cargarUsuarios() {
	try {
		const res = await fetch('/api/usuarios/get-users');
		if (!res.ok) throw new Error('No se pudieron cargar usuarios');
		const usuarios = await res.json();
		usuarioSelect.innerHTML = '<option value="">Seleccione un usuario</option>' + usuarios.map(u => `<option value="${u.id}">${u.nombre} (${u.email})</option>`).join('');
	} catch (e) {
		usuarioSelect.innerHTML = '<option value="">Error al cargar usuarios</option>';
		console.error(e);
	}
}

async function cargarLibros() {
	try {
		const res = await fetch('/api/libros/get-books'); // crear esta ruta en `routes/libroRoutes.js`
		if (!res.ok) throw new Error('No se pudieron cargar libros');
		const libros = await res.json();
		libroSelect.innerHTML = '<option value="">Seleccione un libro</option>' + libros.map(l => `<option value="${l.id}">${l.titulo || ('ID '+l.id)}</option>`).join('');
	} catch (e) {
		libroSelect.innerHTML = '<option value="">No hay ruta de libros (crear /api/libros/get-books)</option>';
		console.error(e);
	}
}

async function listarPrestamos() {
	try {
		const res = await fetch('/api/prestamos/get-prestamos');
		if (!res.ok) throw new Error('No se pudieron listar préstamos');
		const prestamos = await res.json();
		tablaPrestamos.innerHTML = prestamos.map(p => `
			<tr>
				<td>${p.id}</td>
				<td>${p.usuario_id}</td>
				<td>${p.libro_id}</td>
				<td>${p.fecha_prestamo ? new Date(p.fecha_prestamo).toLocaleDateString() : ''}</td>
				<td>${p.fecha_devolucion ? new Date(p.fecha_devolucion).toLocaleDateString() : ''}</td>
				<td>${p.estado}</td>
				<td>
					${p.estado !== 'devuelto' ? `<button data-id="${p.id}" class="devolverBtn">Devolver</button>` : ''}
				</td>
			</tr>
		`).join('');

		document.querySelectorAll('.devolverBtn').forEach(btn => {
			btn.addEventListener('click', async (e) => {
				const id = e.currentTarget.dataset.id;
				if (!confirm('Marcar préstamo como devuelto?')) return;
				await fetch(`/api/prestamos/devolver/${id}`, { method: 'POST' });
				await listarPrestamos();
			});
		});

	} catch (e) {
		tablaPrestamos.innerHTML = '<tr><td colspan="7">Error al listar préstamos</td></tr>';
		console.error(e);
	}
}

formPrestamo.addEventListener('submit', async (e) => {
	e.preventDefault();
	const usuario_id = usuarioSelect.value;
	const libro_id = libroSelect.value;
	const fecha_devolucion = document.getElementById('fechaDevolucion').value || null;

	if (!usuario_id || !libro_id) {
		alert('Seleccione usuario y libro');
		return;
	}

	try {
		const res = await fetch('/api/prestamos/create', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ usuario_id: Number(usuario_id), libro_id: Number(libro_id), fecha_devolucion })
		});
		if (!res.ok) {
			const err = await res.json();
			alert(err.error || 'Error al crear préstamo');
			return;
		}
		alert('Préstamo registrado');
		formPrestamo.reset();
		await listarPrestamos();
	} catch (e) {
		console.error(e);
		alert('Error al crear préstamo');
	}
});

// Inicialización
cargarUsuarios();
cargarLibros();
listarPrestamos();




