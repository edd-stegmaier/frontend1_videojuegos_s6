/**
 * PixelZone — lógica principal
 * Carga productos con Fetch, filtra por búsqueda/categoría
 * y mantiene un resumen dinámico del carrito. 
 */

const RUTA_PRODUCTOS = "assets/data/productos.json";
const IMG_FALLBACK = "https://raw.githubusercontent.com/edd-stegmaier/front1_videojuegos_s1/main/img/";

let catalogo = [];
let productosVisibles = [];
let carrito = [];

document.addEventListener("DOMContentLoaded", inicializar);

/** Punto de entrada: carga datos y registra eventos. */
function inicializar() {
  registrarEventos();
  cargarProductos();
  renderizarCarrito();
}

/** Asocia los eventos requeridos: submit (búsqueda) y click (carrito / categorías). */
function registrarEventos() {
  const formBusqueda = document.getElementById("form-busqueda");
  formBusqueda.addEventListener("submit", manejarBusqueda);

  // Delegación de click para botones "Agregar" generados dinámicamente
  document.getElementById("lista-productos").addEventListener("click", manejarClickCatalogo);

  document.getElementById("vaciar-carrito").addEventListener("click", vaciarCarrito);

  document.querySelectorAll("[data-categoria]").forEach((enlace) => {
    enlace.addEventListener("click", filtrarPorCategoria);
  });
}

/**
 * Carga el catálogo desde un JSON local con Fetch API.
 * Si falla, muestra un mensaje amigable.
 */
async function cargarProductos() {
  const estado = document.getElementById("estado-carga");
  estado.classList.remove("d-none");
  estado.textContent = "Cargando catálogo...";

  try {
    const respuesta = await fetch(RUTA_PRODUCTOS);

    if (!respuesta.ok) {
      throw new Error("Respuesta no válida: " + respuesta.status);
    }

    const datos = await respuesta.json();

    if (!Array.isArray(datos) || datos.length === 0) {
      throw new Error("El archivo JSON no contiene productos.");
    }

    catalogo = datos;
    productosVisibles = datos;
    estado.classList.add("d-none");
    renderizarProductos(productosVisibles);
  } catch (error) {
    console.error("Error al cargar productos:", error);
    mostrarErrorCarga();
  }
}

/** Pinta un aviso visible si el JSON no se pudo leer. */
function mostrarErrorCarga() {
  const estado = document.getElementById("estado-carga");
  const lista = document.getElementById("lista-productos");

  lista.innerHTML = "";
  estado.classList.remove("d-none", "alert-info");
  estado.classList.add("alert-warning");
  estado.textContent =
    "No pudimos cargar el catálogo. Revisa que el archivo JSON exista y abre la página con un servidor local.";
}

/** Dibuja las tarjetas de producto en la grilla principal. */
function renderizarProductos(lista) {
  const contenedor = document.getElementById("lista-productos");
  contenedor.innerHTML = "";

  if (lista.length === 0) {
    contenedor.innerHTML =
      '<p class="text-secondary">No hay productos que coincidan con la búsqueda.</p>';
    return;
  }

  lista.forEach((producto) => {
    const columna = document.createElement("div");
    columna.className = "col-12 col-sm-6 col-xl-4";
    columna.innerHTML = `
      <article class="card product-card h-100 shadow-sm">
        <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}"
             onerror="this.onerror=null;this.src='${IMG_FALLBACK}'+this.src.split('/').pop();">
        <div class="card-body d-flex flex-column">
          <span class="badge text-bg-dark align-self-start mb-2">${producto.categoria} · ${producto.plataforma}</span>
          <h3 class="h5 card-title text-dark">${producto.nombre}</h3>
          <p class="text-warning mb-2">★ ${producto.rating}</p>
          <div class="mt-auto d-flex justify-content-between align-items-center">
            <strong class="text-dark">${formatearPrecio(producto.precio)}</strong>
            <button class="btn btn-dark btn-sm" data-agregar="${producto.id}" type="button">
              Agregar
            </button>
          </div>
        </div>
      </article>
    `;
    contenedor.appendChild(columna);
  });
}

/** Evento submit del formulario de búsqueda. */
function manejarBusqueda(evento) {
  evento.preventDefault();

  const termino = document.getElementById("input-busqueda").value.trim().toLowerCase();

  productosVisibles = catalogo.filter((producto) =>
    producto.nombre.toLowerCase().includes(termino)
  );

  renderizarProductos(productosVisibles);
}

/** Evento click sobre categorías simuladas del navbar / sidebar. */
function filtrarPorCategoria(evento) {
  evento.preventDefault();

  const categoria = evento.currentTarget.dataset.categoria;
  const titulo = document.getElementById("titulo-catalogo");

  if (!categoria) {
    productosVisibles = catalogo;
    titulo.textContent = "Catálogo";
  } else {
    productosVisibles = catalogo.filter((producto) => producto.categoria === categoria);
    titulo.textContent = categoria;
  }

  document.getElementById("input-busqueda").value = "";
  renderizarProductos(productosVisibles);
}

/** Evento click para agregar un producto al carrito. */
function manejarClickCatalogo(evento) {
  const boton = evento.target.closest("[data-agregar]");
  if (!boton) return;

  const id = Number(boton.dataset.agregar);
  agregarAlCarrito(id);
}

/** Suma el producto al carrito o incrementa su cantidad. */
function agregarAlCarrito(id) {
  const producto = catalogo.find((item) => item.id === id);
  if (!producto) return;

  const existente = carrito.find((item) => item.id === id);

  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1
    });
  }

  renderizarCarrito();
}

/** Actualiza el resumen visible del carrito y el contador del navbar. */
function renderizarCarrito() {
  const lista = document.getElementById("resumen-carrito");
  const totalNodo = document.getElementById("total-carrito");
  const contador = document.getElementById("contador-carrito");

  const unidades = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  contador.textContent = unidades;

  if (carrito.length === 0) {
    lista.innerHTML = '<p class="text-secondary mb-0">El carrito está vacío.</p>';
    totalNodo.textContent = formatearPrecio(0);
    return;
  }

  lista.innerHTML = carrito
    .map(
      (item) => `
      <div class="cart-item py-2 d-flex justify-content-between gap-2">
        <div>
          <strong>${item.nombre}</strong>
          <div class="small text-secondary">x${item.cantidad} · ${formatearPrecio(item.precio)}</div>
        </div>
        <span>${formatearPrecio(item.precio * item.cantidad)}</span>
      </div>
    `
    )
    .join("");

  totalNodo.textContent = formatearPrecio(total);
}

function vaciarCarrito() {
  carrito = [];
  renderizarCarrito();
}

/** Formatea montos en pesos chilenos. */
function formatearPrecio(valor) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0
  }).format(valor);
}
