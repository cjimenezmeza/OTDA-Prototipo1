document.addEventListener('DOMContentLoaded', function() {
    const navButtons = document.querySelectorAll('.nav-button');
    const sections = document.querySelectorAll('.section');
    const printButton = document.getElementById('print-button');

    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            sections.forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(sectionId).classList.add('active');
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });

    printButton.addEventListener('click', function() {
        window.print();
    });

    // Form submission for Cargar Tesis
    const cargarForm = document.getElementById('cargar-form');
    cargarForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        fetch('procesar.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            if (data.success) {
                cargarForm.reset();
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un error al procesar la solicitud.');
        });
    });

    // Form submission for Búsqueda Avanzada
    const busquedaForm = document.getElementById('busqueda-form');
    const resultadosBusqueda = document.getElementById('resultados-busqueda');
    busquedaForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        fetch('buscar.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            resultadosBusqueda.innerHTML = '';
            if (data.length === 0) {
                resultadosBusqueda.innerHTML = '<p>No se encontraron resultados.</p>';
            } else {
                data.forEach(tesis => {
                    const tesiElement = document.createElement('div');
                    tesiElement.innerHTML = `
                        <h3>${tesis.titulo}</h3>
                        <p>Autor: ${tesis.autor}</p>
                        <p>${tesis.resumen}</p>
                        <a href="${tesis.archivo}" target="_blank">Ver PDF</a>
                    `;
                    resultadosBusqueda.appendChild(tesiElement);
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            resultadosBusqueda.innerHTML = '<p>Hubo un error al realizar la búsqueda.</p>';
        });
    });

    // Load tesis for Visualizar section
    function loadTesis() {
        fetch('obtener_tesis.php')
        .then(response => response.json())
        .then(data => {
            const tesisList = document.getElementById('tesis-list');
            tesisList.innerHTML = '';
            data.forEach(tesis => {
                const tesiElement = document.createElement('div');
                tesiElement.innerHTML = `
                    <h3>${tesis.titulo}</h3>
                    <p>Autor: ${tesis.autor}</p>
                    <p>${tesis.resumen}</p>
                    <a href="${tesis.archivo}" target="_blank">Ver PDF</a>
                `;
                tesisList.appendChild(tesiElement);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('tesis-list').innerHTML = '<p>Hubo un error al cargar las tesis.</p>';
        });
    }

    // Load tesis when Visualizar section is activated
    navButtons.forEach(button => {
        if (button.getAttribute('data-section') === 'visualizar') {
            button.addEventListener('click', loadTesis);
        }
    });
});