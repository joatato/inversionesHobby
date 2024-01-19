function eliminarProyecto(projectId) {
    // Realiza una solicitud AJAX o utiliza fetch para eliminar el proyecto por su ID
    // Puedes ajustar la URL y el método según tu API y modelo de datos
    fetch(`/api/projects/${projectId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        // Puedes incluir encabezados de autenticación si es necesario
      },
    })
    .then(response => response.json())
    .then(data => {
      // Maneja la respuesta del servidor, por ejemplo, actualizando la interfaz de usuario
      eliminarProyectoDeLaVista(projectId)
      console.log('Proyecto eliminado:', data);
    })
    .catch(error => {
      console.error('Error al eliminar el proyecto:', error);
    });
  }
  

  /* FUNCION DE ELIMINACION DEL CONTENEDOR DEL PROYECTO MODO ADMIN */
  function eliminarProyectoDeLaVista(projectId) {
    // Realizar la solicitud de eliminación (puedes usar fetch, axios, etc.)

    // Después de confirmar la eliminación en el servidor, eliminar visualmente el proyecto
    const projectContainer = document.querySelector(`.project-card[data-project-id="${projectId}"]`);
    
    if (projectContainer) {
        // Si se encuentra el contenedor del proyecto, eliminarlo del DOM
        projectContainer.remove();
    }
}
