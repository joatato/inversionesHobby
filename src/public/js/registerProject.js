// Función para previsualizar la imagen seleccionada
function previewImage(event) {
    const input = event.target;
    const preview = document.getElementById('preview');

    if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };

        reader.readAsDataURL(input.files[0]);

        document.getElementById('drag-text').style.display = 'none';

    } else {
        document.getElementById('drag-text').style.display = 'block';
        preview.src = '#';
        preview.style.display = 'none';
    }
}

// Funciones para manejar eventos de arrastrar y soltar
function handleDragOver(event) {
    event.preventDefault();
    document.getElementById('drop-area').classList.add('dragover');
}

function handleDragLeave(event) {
    event.preventDefault();
    document.getElementById('drop-area').classList.remove('dragover');
}

// Función para manejar eventos de arrastrar y soltar
function handleDrop(event) {
    event.preventDefault();
    document.getElementById('drop-area').classList.remove('dragover');

    const fileInput = document.getElementById('thumbnail');
    const droppedFiles = event.dataTransfer.files;

    if (droppedFiles.length > 0) {
        fileInput.files = droppedFiles;
        previewImage({ target: fileInput });
    }
}

function revisarDatos(formData) {
    const name = formData.name
    // const name = formData.get('name');
    // const description = formData.get('description');
    // const amountNecessary = formData.get('amountNecessary');
    // const steps = formData.get('steps');
    // const locationAddress = formData.get('location.address');
    // const locationCity = formData.get('location.city');
    // const locationState = formData.get('location.state');
    // const locationCountry = formData.get('location.country');
    // const locationProvince = formData.get('location.province');
    // const thumbnail = formData.get('thumbnail');

    // // Realiza la validación de los datos según tus criterios
    // if (!name || !description || !amountNecessary || !steps || !locationAddress || !locationCity || !locationState || !locationCountry || !locationProvince || !thumbnail) {
    //     console.log("Faltan datos");
    //     return false; // Detiene el envío del formulario si hay campos vacíos
    // }

    // Puedes agregar más validaciones según sea necesario
    if (!name) {
        console.log("No ingreso nombre");
        return false
    }
    return true; // Continúa con el envío del formulario si todos los datos son válidos
}



function submitForm() {
    console.log("Se lee el submit");
    // Obtener los datos del formulario
    const formData = new FormData(document.getElementById('projectForm'));

    // Realizar la solicitud POST usando Fetch
    if (revisarDatos(formData)) {
        console.log("Un exito el ingreso de datos");
        fetch('/api/projects', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                // Manejar la respuesta del servidor
                console.log('Respuesta del servidor:', data);
            })
            .catch(error => {
                // Manejar errores de la solicitud
                console.error('Error en la solicitud:', error);
            });
    } else {
        alert('Todos los campos son obligatorios. Por favor, complete el formulario.');
    }
}