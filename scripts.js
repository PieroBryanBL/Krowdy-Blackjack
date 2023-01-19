/* Referencias */
const btnNuevoJuego = document.querySelector("#btnNuevoJuego"),
  btnPedirCarta = document.querySelector("#btnPedirCarta"),
  btnDetener = document.querySelector("#btnDetener"),
  puntosHTML = document.querySelectorAll("small"),
  jugadoresCartas = document.querySelectorAll(".cartas");

/* Variables */
let baraja = [],
  jugadoresPuntos = [];

  /* Declarar tipos de cartas */
const tipos = ["C", "D", "H", "S"],
  especiales = ["A", "J", "Q", "K"];

/*
 * C = Treboles
 * D = Diamantes
 * H = Corazones
 * S = Espadas
 */

/* Inicializa el juego */
const init = (cantidadJugadores = 3) => {
  baraja = crearBaraja();
  jugadoresPuntos = [];
  turno = 0;

  for (let i = 0; i < cantidadJugadores; i++) jugadoresPuntos.push({id: i < cantidadJugadores - 1 ? `Jugador ${i + 1}` :"Computadora", points: 0});

  for (let jugador in jugadoresPuntos) {
    puntosHTML[jugador].textContent = 0;
    jugadoresCartas[jugador].textContent = "";
  }

  habilitarBotones();
};

/* Esta función desactiva los botones pedir y detener */
const habilitarBotones = () => {
  btnPedirCarta.disabled = false;
  btnDetener.disabled = false;
};

const deshabilitarBotones = () => {
  btnPedirCarta.disabled = true;
  btnDetener.disabled = true;
};

/* Se encarga de crear la baraja */
const crearBaraja = () => {
  baraja = [];

  for (let tipo of tipos) {
    for (let i = 2; i <= 10; i++) baraja.push(i + tipo);

    for (let especial of especiales) baraja.push(especial + tipo);
  }

  return _.shuffle(baraja);
};

/* Obtiene una carta de la baraja */
const obtenerCarta = () => {
  if (baraja.length <= 0) throw "No hay cartas en la baraja";

  return baraja.pop();
};

/**
 * - Obtener valor de la carta
 * - Acumular puntos
 *
 *
 */

/* Acumula los puntos de los jugadores */
const acumularPuntos = ({ carta, turno }) => {
  jugadoresPuntos[turno].points += obtenerValorDeCarta(carta);
  puntosHTML[turno].textContent = jugadoresPuntos[turno].points;

  return jugadoresPuntos[turno];
};

/* Recibe un valor de la carta */
const obtenerValorDeCarta = (carta) => {
  const valor = carta.substring(0, carta.length - 1);

  return !isNaN(valor) ? valor * 1 : valor === "A" ? 11 : 10;
};

/* Crea la carta en el HTML */
const crearCartasDOM = ({ carta, turno }) => {
  const imagen = document.createElement("img");
  imagen.src = `assets/${carta}.png`;
  imagen.classList.add("carta");
  jugadoresCartas[turno].append(imagen);
};

const turnoComputadora = (puntosMinimos) => {
  let ComputadoraPuntos = 0;

  setTimeout (() => {
    
  do {
    const carta = obtenerCarta();
    /* Siempre turnar al final a la Computadora */
    ComputadoraPuntos = acumularPuntos({ carta, turno: jugadoresPuntos.length - 1 });
    crearCartasDOM({ carta, turno: jugadoresPuntos.length - 1 }); } while (ComputadoraPuntos < puntosMinimos && puntosMinimos <= 21);

  determinarGanador(jugadoresPuntos);

  }, 900)
}

/* Determina el ganador y lo alerta */
const determinarGanador = (jugadoresPuntos) => {
  const [puntosJugadorUno, puntosJugadorDos, puntosComputadora] = jugadoresPuntos;

  /* Da un delay */
  setTimeout(() => {
    
    if(puntosJugadorUno.points > puntosJugadorDos.points && puntosJugadorUno.points > puntosComputadora.points && puntosJugadorUno.points < 21) {
      alert("Jugador 1 ha ganado la partida")
    } 

    if(puntosJugadorDos.points > puntosJugadorUno.points && puntosJugadorDos.points > puntosComputadora.points && puntosJugadorDos.points < 21) {
      alert("Jugador 2 ha ganado la partida")
    } 

    if(puntosComputadora.points > puntosJugadorUno.points && puntosComputadora.points > puntosJugadorDos.points && puntosComputadora.points < 21) {
      alert("Computadora ha ganado la partida")
      return
    }

    /* Ejecuta que si son iguales, nadie resulta ganador */
    if ((puntosJugadorUno.points === puntosJugadorDos.points) === puntosComputadora.points) {
      alert("Nadie resulta ganador");
      return;
    }

  }, 200); 
};

/** Eventos al dar click */

btnNuevoJuego.addEventListener("click", () => {
  init();
});

btnPedirCarta.addEventListener("click", () => {
  const carta = obtenerCarta();
  const jugadorPuntos = acumularPuntos({ carta, turno });
  crearCartasDOM({ carta, turno });

  if (jugadorPuntos.points < 21) return;
  
  deshabilitarBotones();
  turnoComputadora(Math.min(...jugadoresPuntos));

  if (!turnoFinal()) {
    turnoSiguiente();
    return;
  }
});

btnDetener.addEventListener("click", () => {
  if (!turnoFinal()) {
    turnoSiguiente();
    return;
    
  }
  /* Método Math */
  turnoComputadora(Math.min(...jugadoresPuntos));
  deshabilitarBotones();
  
});

/* Dar turno siguiente */
const turnoSiguiente = () => {
  turno += 1;

};
const turnoFinal = () => {
  return turno === jugadoresPuntos.length - 2;
};