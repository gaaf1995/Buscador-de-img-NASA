const inputBuscar = document.getElementById('inputBuscar');
const btnBuscar = document.getElementById('btnBuscar');
const contenedor = document.getElementById('contenedor');

// Creación de tarjetas
function crearTarjeta(imagen, titulo, descripcion, fecha, id) {
  return `
    <div class="col-md-4">
      <div class="card mb-4 shadow-sm">
        <img src="${imagen}" class="card-img-top" alt="${titulo}">
        <div class="card-body">
          <h5 class="card-title">${titulo}</h5>
          <p class="card-text"><small class="text-muted">Fecha: ${fecha}</small></p>
          <button class="btn btn-link p-0" data-bs-toggle="collapse" data-bs-target="#descripcion-${id}" aria-expanded="false" aria-controls="descripcion-${id}">
            Ver descripción
          </button>
          <div class="collapse" id="descripcion-${id}">
            <p class="card-text mt-2">${descripcion}</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Buscador
async function buscarImagenes() {
  const query = inputBuscar.value.trim();
  
  if (!query) {
    alert('Por favor, ingresa un término de búsqueda.');
    return;
  }

  const url = `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url);
    const datos = await response.json();

    if (!datos.collection || !datos.collection.items.length) {
      contenedor.innerHTML = '<p class="text-center">No se encontraron resultados para tu búsqueda.</p>';
      return;
    }

    // Generación de tarjetas
    const tarjetas = datos.collection.items.map((item, index) => {
      const titulo = item.data[0]?.title || 'Sin título';
      const descripcion = item.data[0]?.description || 'Sin descripción disponible';
      const fecha = item.data[0]?.date_created?.split('T')[0] || 'Fecha no disponible';
      const imagen = item.links?.[0]?.href || 'https://via.placeholder.com/150';

      return crearTarjeta(imagen, titulo, descripcion, fecha, index);
    });

    // Insertar las tarjetas en el contenedor
    contenedor.innerHTML = tarjetas.join('');
  } catch (error) {
    console.error('Error al realizar la solicitud:', error);
    contenedor.innerHTML = '<p class="text-center text-danger">Ocurrió un error al cargar los datos. Inténtalo de nuevo más tarde.</p>';
  }
}

btnBuscar.addEventListener('click', buscarImagenes);
