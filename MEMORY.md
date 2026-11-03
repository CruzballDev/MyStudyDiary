# [MEMORY.md](http://MEMORY.md) — Diario de Estudio

Memoria del proyecto entre sesiones. Máximo ~50 líneas: resume o elimina lo que ya no aporte.

## Estado actual

- v1.1 funcionando: registrar sesiones (fecha, tema, minutos), racha actual y mejor racha (lado a lado en la tarjeta morada), y lista de sesiones.

- Datos en localStorage.

## Decisiones (y por qué)

- Sin backend ni dependencias: cualquiera debe poder abrirlo con doble clic.

- Fecha editable en el formulario: permite registrar días pasados y ver la racha crecer.

- Datos con clave `diario-estudio-sesiones` y campos en español (`fecha`, `tema`, `minutos`): el usuario definió la clave y pidió textos en español. La clave antigua `sesiones-diario` (v1) se migra sola en el primer arranque; no volver a escribirla.

- La mejor racha se calcula cada vez (`calcularMejorRacha()`), no se guarda: es derivada y evita cambiar el formato de datos guardados.

- Fechas futuras no suman a ninguna de las dos rachas (decisión del usuario).

- Emoji ⭐ para la mejor racha vs 🔥 para la actual, para distinguirlas a simple vista (revisable).

## Aprendizajes y errores a evitar

- (vacío por ahora)

## Próximos pasos

- (vacío por ahora)