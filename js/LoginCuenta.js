document.addEventListener('DOMContentLoaded', function() {
const loginForm = document.getElementById('login-form');
const API_URL = 'http://localhost:3306/api';

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Obtener datos del formulario
        const email = loginForm.querySelector('input[type="email"]').value;
        const password = loginForm.querySelector('input[type="password"]').value;

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Email: email,
                    Contraseña: password    
                })
            });

            const data = await response.json();

             if (response.ok) {
                alert(data.mensaje || 'Usuario ingresando al sistema');
                loginForm.reset();
                // Redireccionar o hacer algo con el usuario logueado
                console.log(data.Usuario);
            } else {
                alert(data.message || 'Error al ingresar al sistema');
                loginForm.reset();
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error de conexión con el servidor');
        }
    });
});

