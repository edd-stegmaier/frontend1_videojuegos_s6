# PixelZone — frontend1_videojuegos_s6

Nueva versión de la tienda de videojuegos [front1_videojuegos_s1](https://github.com/edd-stegmaier/front1_videojuegos_s1), adaptada a Bootstrap 5, Fetch API y un carrito dinámico.

## Vizualizar página

```bash
# Opción rápida con Python
python -m http.server 8080
```

Luego abrir [http://localhost:8080](http://localhost:8080).

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
