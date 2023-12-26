const form = document.getElementById('loginForm');

function revisarDatos(datos) {
    const password = datos.password
    if (password.length > 2 ) {
        return true
    }else{
        return false
    }
}

form.addEventListener('submit', evt => {
    evt.preventDefault();

    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    const body = { email, password }

    console.log(body);
    if (revisarDatos(body)) {
        
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
    }else{
        alert("Datos erroneoooos")
    }

})


// Event listener para el botón de registro
document.getElementById('registerButton').addEventListener('click', function () {
    // Redirige al usuario a la página de registro
    window.location.href = '/register'; // Ajusta la URL según tu estructura de archivos
});