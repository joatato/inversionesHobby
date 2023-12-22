const form = document.getElementById('loginForm');

form.addEventListener('submit', evt => {
    evt.preventDefault();

    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    const body = { email, password }

    console.log(body);

    fetch('/api/sessions/login', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result => {
        return result.json()
    }).then(json => {
        console.log(json);
        localStorage.setItem('CoderTouukken', json.token)
        document.cookie = `codertokenCliente=${json.token};max-age=3600`
        document.location.href = `/?token=${json.token}`;
    }).catch(Error => {
        console.log(Error)
    })

})


// Event listener para el botón de registro
document.getElementById('registerButton').addEventListener('click', function () {
    // Redirige al usuario a la página de registro
    window.location.href = '/register'; // Ajusta la URL según tu estructura de archivos
});