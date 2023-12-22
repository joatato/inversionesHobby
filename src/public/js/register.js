document.getElementById('registroForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const usuario = document.getElementById('usuario').value;
    const contrasena = document.getElementById('contrasena').value;
    const email = document.getElementById('email').value;

    // Validación básica del lado del cliente
    if (!usuario || !contrasena||!email) {
        alert('Por favor, complete todos los campos.');
        return;
    }

    // Enviar datos al servidor (usando fetch en este ejemplo)
    fetch('/api/sessions/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name:usuario, password:contrasena,email }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Manejar la respuesta del servidor, por ejemplo, mostrar un mensaje al usuario
            if (data.error) {
                alert(data.error);
            } else if (data.message) {
                alert(data.message);
                // Redirigir al usuario a la página de inicio de sesión
                window.location.href = '/login';
            } else {
                console.error('Respuesta del servidor inesperada:', data);
            }
        })
        .catch(error => {
            console.error('Error al enviar datos al servidor:', error.message);
        });
});
document.getElementById('loguerButton').addEventListener('click', function () {
    // Redirige al usuario a la página de registro
    window.location.href = '/login'; // Ajusta la URL según tu estructura de archivos
});