const CLAVE_ALMACEN = "diario-estudio-sesiones";
const CLAVE_ANTIGUA = "sesiones-diario";

const campoFecha = document.getElementById("fecha");
const campoTema = document.getElementById("tema");
const campoMinutos = document.getElementById("minutos");
const formulario = document.getElementById("formulario");
const lista = document.getElementById("lista-sesiones");
const mensajeVacio = document.getElementById("mensaje-vacio");
const rachaNumero = document.getElementById("racha");
const rachaTexto = document.getElementById("racha-texto");
const mejorRachaNumero = document.getElementById("mejor-racha");
const mejorRachaTexto = document.getElementById("mejor-racha-texto");
const totalSemana = document.getElementById("total-semana");
const totalSemanaValor = document.getElementById("total-semana-valor");
const totalMesValor = document.getElementById("total-mes-valor");

function obtenerFechaLocal(date) {
  const anio = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  const dia = String(date.getDate()).padStart(2, "0");
  return `${anio}-${mes}-${dia}`;
}

function crearFechaLocal(textoFecha) {
  const [anio, mes, dia] = textoFecha.split("-").map(Number);
  return new Date(anio, mes - 1, dia);
}

function sumarDias(date, cantidad) {
  const copia = new Date(date);
  copia.setDate(copia.getDate() + cantidad);
  return copia;
}

function cargarSesiones() {
  const guardado = localStorage.getItem(CLAVE_ALMACEN);
  if (guardado !== null) {
    try {
      const datos = JSON.parse(guardado);
      return Array.isArray(datos) ? datos : [];
    } catch {
      return [];
    }
  }

  const antiguo = localStorage.getItem(CLAVE_ANTIGUA);
  if (antiguo === null) return [];

  try {
    const datos = JSON.parse(antiguo);
    if (Array.isArray(datos)) {
      guardarSesiones(datos);
      localStorage.removeItem(CLAVE_ANTIGUA);
      return datos;
    }
  } catch {
    return [];
  }
  return [];
}

function guardarSesiones(sesiones) {
  localStorage.setItem(CLAVE_ALMACEN, JSON.stringify(sesiones));
}

function calcularRacha(sesiones) {
  const diasConSesion = new Set(sesiones.map(s => s.fecha));
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  let inicio = hoy;
  if (!diasConSesion.has(obtenerFechaLocal(hoy))) {
    const ayer = sumarDias(hoy, -1);
    if (!diasConSesion.has(obtenerFechaLocal(ayer))) return 0;
    inicio = ayer;
  }

  let racha = 0;
  let diaActual = inicio;
  while (diasConSesion.has(obtenerFechaLocal(diaActual))) {
    racha++;
    diaActual = sumarDias(diaActual, -1);
  }
  return racha;
}

function calcularMejorRacha(sesiones) {
  const hoy = obtenerFechaLocal(new Date());
  const diasUnicos = [...new Set(sesiones.map(s => s.fecha))]
    .filter(fecha => fecha <= hoy)
    .sort();

  let mejor = 0;
  let racha = 0;
  let fechaAnterior = null;

  for (const fecha of diasUnicos) {
    if (fechaAnterior !== null) {
      const diaTrasAnterior = obtenerFechaLocal(sumarDias(crearFechaLocal(fechaAnterior), 1));
      racha = diaTrasAnterior === fecha ? racha + 1 : 1;
    } else {
      racha = 1;
    }
    mejor = Math.max(mejor, racha);
    fechaAnterior = fecha;
  }
  return mejor;
}

function textoDias(cantidad) {
  return cantidad === 1 ? "día seguido" : "días seguidos";
}

// La semana de estudio va de lunes a domingo. Devuelve el lunes local de la semana actual.
function obtenerInicioSemana() {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const diasDesdeLunes = (hoy.getDay() + 6) % 7;
  return sumarDias(hoy, -diasDesdeLunes);
}

function calcularMinutosSemana(sesiones) {
  const inicio = obtenerFechaLocal(obtenerInicioSemana());
  const hoy = obtenerFechaLocal(new Date());

  let total = 0;
  for (const sesion of sesiones) {
    if (sesion.fecha >= inicio && sesion.fecha <= hoy) {
      total += Number(sesion.minutos) || 0;
    }
  }
  return total;
}

// El total del mes cuenta desde el día 1 del mes actual (fecha local).
function obtenerInicioMes() {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return new Date(hoy.getFullYear(), hoy.getMonth(), 1);
}

// Días distintos con sesión y minutos totales acumulados en lo que va de mes.
// Solo cuentan fechas hasta hoy: las futuras no suman ni días ni minutos.
function calcularResumenMes(sesiones) {
  const inicio = obtenerFechaLocal(obtenerInicioMes());
  const hoy = obtenerFechaLocal(new Date());

  const diasConSesion = new Set();
  let total = 0;
  for (const sesion of sesiones) {
    if (sesion.fecha >= inicio && sesion.fecha <= hoy) {
      diasConSesion.add(sesion.fecha);
      total += Number(sesion.minutos) || 0;
    }
  }
  return { dias: diasConSesion.size, minutos: total };
}

function textoDiasMes(dias) {
  return dias === 1 ? "1 día" : `${dias} días`;
}

function textoTiempo(minutos) {
  if (minutos < 60) return `${minutos} min`;
  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;
  return resto === 0 ? `${horas} h` : `${horas} h ${resto} min`;
}

function formatearFecha(textoFecha) {
  return crearFechaLocal(textoFecha).toLocaleDateString("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function renderizar(sesiones) {
  const ordenadas = [...sesiones].sort((a, b) => b.fecha.localeCompare(a.fecha));

  lista.innerHTML = "";
  mensajeVacio.hidden = ordenadas.length > 0;

  for (const sesion of ordenadas) {
    const item = document.createElement("li");
    item.className = "sesion";

    const info = document.createElement("div");
    const tema = document.createElement("p");
    tema.className = "sesion-tema";
    tema.textContent = sesion.tema;
    const detalles = document.createElement("p");
    detalles.className = "sesion-detalles";
    detalles.textContent = formatearFecha(sesion.fecha);
    info.appendChild(tema);
    info.appendChild(detalles);

    const minutos = document.createElement("span");
    minutos.className = "sesion-minutos";
    minutos.textContent = `${sesion.minutos} min`;

    item.appendChild(info);
    item.appendChild(minutos);
    lista.appendChild(item);
  }

  const racha = calcularRacha(sesiones);
  rachaNumero.textContent = racha;
  rachaTexto.textContent = textoDias(racha);

  const mejorRacha = calcularMejorRacha(sesiones);
  mejorRachaNumero.textContent = mejorRacha;
  mejorRachaTexto.textContent = textoDias(mejorRacha);

  const minutosSemana = calcularMinutosSemana(sesiones);
  totalSemanaValor.textContent = textoTiempo(minutosSemana);

  const resumenMes = calcularResumenMes(sesiones);
  totalMesValor.textContent = `${textoDiasMes(resumenMes.dias)} y ${textoTiempo(resumenMes.minutos)}`;
}

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const minutos = Number(campoMinutos.value);
  if (!Number.isFinite(minutos) || minutos <= 0) {
    campoMinutos.setCustomValidity("Los minutos deben ser un número mayor que 0");
    campoMinutos.reportValidity();
    return;
  }
  campoMinutos.setCustomValidity("");

  const nuevaSesion = {
    fecha: campoFecha.value,
    tema: campoTema.value.trim(),
    minutos: minutos,
  };

  const sesiones = cargarSesiones();
  sesiones.push(nuevaSesion);
  guardarSesiones(sesiones);

  formulario.reset();
  campoFecha.value = obtenerFechaLocal(new Date());
  renderizar(sesiones);
});

campoFecha.value = obtenerFechaLocal(new Date());
renderizar(cargarSesiones());
