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



