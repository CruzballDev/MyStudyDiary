# [MEMORY.md](http://MEMORY.md) — Diario de Estudio

Memoria del proyecto entre sesiones. Máximo ~50 líneas: resume o elimina lo que ya no aporte.

## Estado actual

- v1.3 funcionando: registrar sesiones (fecha, tema, minutos), racha actual y mejor racha (lado a lado en la tarjeta morada), total de minutos estudiados esta semana (línea bajo la tarjeta), total de días y minutos de este mes (segunda línea bajo la tarjeta) y lista de sesiones.

- Datos en localStorage.

## Decisiones (y por qué)

- Sin backend ni dependencias: cualquiera debe poder abrirlo con doble clic.

- Fecha editable en el formulario: permite registrar días pasados y ver la racha crecer.

- Datos con clave `diario-estudio-sesiones` y campos en español (`fecha`, `tema`, `minutos`): el usuario definió la clave y pidió textos en español. La clave antigua `sesiones-diario` (v1) se migra sola en el primer arranque; no volver a escribirla.

- La mejor racha se calcula cada vez (`calcularMejorRacha()`), no se guarda: es derivada y evita cambiar el formato de datos guardados.
- El total semanal también es derivado (`calcularMinutosSemana()`): semana de lunes a domingo, cuentan solo fechas hasta hoy (el usuario eligió ambas opciones); minutos>=60 se muestran como "X h Y min" (`textoTiempo()`). Comparaciones de fecha hechas con strings "AAAA-MM-DD", sin Date APIs en la comparación. Estructura de la línea: `#total-semana-valor` (solo el número) dentro de `.total-semana` (el texto fijo).

- Fechas futuras no suman a ninguna de las dos rachas (decisión del usuario).

- El total del mes es derivado, se recalcula en cada render (`calcularResumenMes()` devuelve `{ dias, minutos }` en un solo bucle): días distintos con sesión del día 1 del mes a hoy; minutos con el mismo rango. Futuras no suman ni días ni minutos. Se muestra en una línea bajo la semanal: "Este mes estudiaste N días y X h Y min" (texto fijo fuera del `<strong>` id="total-mes-valor", mismo patrón que el semanal). El usuario pidió contar también minutos del mes, no solo días.

- Emoji ⭐ para la mejor racha vs 🔥 para la actual, para distinguirlas a simple vista (revisable).

## Aprendizajes y errores a evitar

- (vacío por ahora)

## Próximos pasos

- (vacío por ahora)