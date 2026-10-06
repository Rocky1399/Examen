# Gestor de Publicaciones

Es donde se hace el CRUD y se pueden visuualizar los datos
Esta hecho con React y Redux

## Cómo correrlo
(comandos: npm install, npm run dev, npm test, npm run build)
(credenciales: emilys / emilyspass, y por qué no sirve kminchelle)

## Qué está hecho
(lista corta: login, rutas protegidas, tabla con visualizar, editar, actualizar y borrar, formulario con validaciones, cancelar, crear y editar tests)

## Estructura del proyecto
(las carpetas api/, features/, store/, pages/, components/ y hooks/, con una línea de para qué sirve cada una)

## Decisiones técnicas
- ¿Por qué separé api/ de Redux? Si cambias Axios por fetch, solo tocas api/; además se puede simular en los tests
- ¿Por qué el token se guarda con un listener y no en el reducer? Los reducers deben ser puros; localStorage es un efecto secundario
- ¿Por qué la tabla despacha setPage y no fetchPosts?"Una sola fuente de verdad la query y un solo lugar que pide datos"
- ¿Por qué debounce en la búsqueda? Evitar una petición por tecla, el 429 y el parpadeo
- ¿Cómo combiné filtros si la API no lo permite? Se pide el filtro más selectivo, se filtra el resto en el cliente con .filter() y se pagina con .slice()
- ¿Por qué el borrado es optimista? La fila desaparece al instante y, si falla, se restaura con el post completo guardado en removed

## Problemas que encontré y cómo los resolví
- El usuario de prueba del enunciado ya no existe
- El post creado desaparecía al volver a la tabla → loadedQuery
- no guarda los datos de publicaciones creadas

## Pendiente / qué haría con más tiempo
- PDF (si no lo alcanzas)
- Editar al recargar la página (pedir GET /posts/:id)
- Conservar los cambios al cambiar de página
- POST /posts/add siempre devuelve id 252
- Login con componentes de PrimeReact
- Más tests