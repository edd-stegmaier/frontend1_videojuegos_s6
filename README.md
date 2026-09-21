# PixelZone — frontend1_videojuegos_s6

Nueva versión de la tienda de videojuegos [front1_videojuegos_s1](https://github.com/edd-stegmaier/front1_videojuegos_s1), adaptada a Bootstrap 5, Fetch API y un carrito dinámico.

## Cómo verla

La carga de productos usa `fetch()` sobre un JSON local. Eso no funciona abriendo el `index.html` como archivo (`file://`). Hay que servir la carpeta:

```bash
# Opción rápida con Python
python3 -m http.server 8080
```

Luego abrir [http://localhost:8080](http://localhost:8080).

Las portadas viven en `assets/img/`. Si al clonar no aparecen, cópialas desde [front1_videojuegos_s1/img](https://github.com/edd-stegmaier/front1_videojuegos_s1/tree/main/img). La página también usa esas imágenes como respaldo.

El banner superior es un carrusel de Bootstrap (`#heroCarousel`) que rota cada 3 segundos. Para cambiar las fotos, reemplaza estos archivos:

- `assets/img/banner-gta.webp`
- `assets/img/banner-ofertas.jpg`
- `assets/img/banner-rpg.jpg`
- `assets/img/banner-noche.webp`

Mientras no existan, se muestran las portadas actuales del catálogo.

## Estructura

```
index.html
assets/css/styles.css
assets/js/app.js
assets/data/productos.json
assets/img/
```

## Requisitos cubiertos

- Página principal con listado de productos (imagen, nombre y precio).
- Navbar responsiva de Bootstrap 5 con categorías simuladas (Acción y RPG).
- Footer con contacto y redes.
- Evento `click` para agregar al carrito.
- Evento `submit` para buscar productos.
- Resumen dinámico del carrito.
- Fetch del JSON local y mensaje de error si la carga falla.
- JS separado en funciones reutilizables y comentado.
