const esInversor = true; // Cambiar según el rol del usuario

// Obtener el botón de inversión
const invertirBtn = document.getElementById('invertirBtn');

// Verificar el rol y mostrar/ocultar el botón de inversión
if (esInversor) {
    invertirBtn.style.display = 'block';
} else {
    invertirBtn.style.display = 'none';
}

// Evento click para el botón de inversión (puedes agregar tu lógica aquí)
invertirBtn.addEventListener('click', () => {
    alert('Has hecho clic en el botón de inversión. Puedes agregar tu lógica aquí.');
});