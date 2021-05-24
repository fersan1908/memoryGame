const gameBox = document.getElementById("game");
const allCards = document.querySelectorAll(".back");
const playBtn = document.getElementById("playBtn");
const crono = document.querySelectorAll(".crono");
//Variable para dar permiso para empezar a clickar sobre cartas. (mientras roten queda false y cuando se detengan queda true)
let ready = false;
//Creamos array para registrar las ultimas tarjetas clickadas y trabajar con ellas.
let cardClicks = [];
let interval;

/******************************************/
/*Lógica del cronómetro en completar juego*/
/******************************************/
const printTime = (first) => {
    const diference =  secondTime = new Date().getTime() - first;
    const milliseconds = String(diference).slice(-3);
        let seconds = (diference / 1000);
        let minutes = Math.floor(seconds / 60);
        let hours = "";
        if (minutes > 59) {
            hours = Math.floor(minutes / 60);
            hours = (hours >= 10) ? hours : "0" + hours;
            minutes = minutes - (hours * 60);
            minutes = (minutes >= 10) ? minutes : "0" + minutes;
        }
        seconds = Math.floor(seconds % 60);
        seconds = (seconds >= 10) ? seconds : "0" + seconds;
        crono[0].textContent = minutes;
        crono[1].textContent = seconds;
        crono[2].textContent = milliseconds;
}

/*****************************************/
/*Lógica de la colocación de las tarjetas*/
/*****************************************/
//Función pone las parejas de pokemons aleatoriamente en las cartas del DOM (pide por parametro el numero de cartas que hay en html)
const getRandomPokemon = (cards) => {
    //Traemos la mitad de pokemons aleatorios que cartas hay en html sin que se repita ninguno
    let randomPokemons = [];
    while(randomPokemons.length < cards / 2){
        let random = Math.floor((Math.random() * (150 - 1 + 1)) + 1);
        !randomPokemons.includes(random) ? randomPokemons.push(random) : "";
    }

    //Creamos un array de tantas posiciones como cartas hay, con valores de numeros aleatorios entre 0 y las cartas que haya y que no se repitan
    let randomPositions = [];
    while(randomPositions.length < cards){
        let random = Math.floor((Math.random() * (cards - 0 + 0)) + 0);
        !randomPositions.includes(random) ? randomPositions.push(random) : "";
    }

    //Usamos los las randomPositions para asignar los randomPokemons que hemos traido a las cartas del dom
    let count = 0; 
    for (let i = 0; i < cards; i++) { //si no entiendes este for me dices.
        /*allCards[randomPositions[i]].textContent = randomPokemons[count];*/
        allCards[randomPositions[i]].dataset.pokeNum = randomPokemons[count];
        allCards[randomPositions[i]].children[0].setAttribute("src", `./assets/img/pokemons/${randomPokemons[count]}.png`);
        i %2 !== 0 ? count++ : "";
    }
}

//Función que devuelve true o false dependiendo si todas las parejas están completadas o no.
const gameEnded = (allCards) => {
    let ended = true;
    for (let i = 0; i < allCards.length; i++) {
        if(!allCards[i].parentElement.classList.contains("completed")){
            ended = false;
            break;
        }
    }
    return ended;
}
playBtn.addEventListener("click", ()=>{
    //Nos aseguramos de borrar todas las clases que puedan tener las tarjetas de partidas anteriores para que no interfieran.
    for (let i = 0; i < allCards.length; i++) {
        allCards[i].parentElement.classList.remove("showCard");
        allCards[i].parentElement.classList.remove("hideCard");
        allCards[i].parentElement.classList.remove("completed");  
    }

    interval !== "" ? clearInterval(interval) : "";
    playBtn.textContent = "Reiniciar";
    crono[0].textContent = "00";
    crono[1].textContent = "00";
    crono[2].textContent = "00";
    getRandomPokemon(allCards.length);

    //Limpiar el array de registro de clicks
    cardClicks = [];

    //Muestra todas las tarjetas antes de empezar la partida durante X segundos, luego las voltea y empieza el juego.
    for (let i = 0; i < allCards.length; i++) {
        allCards[i].parentElement.classList.add("showCard");
    }
    setTimeout(() => {
        for (let i = 0; i < allCards.length; i++) {
            allCards[i].parentElement.classList.add("hideCard");
        }
    }, 3000);
    setTimeout(() => {
        for (let i = 0; i < allCards.length; i++) {
            allCards[i].parentElement.classList.remove("showCard");
            allCards[i].parentElement.classList.remove("hideCard");
            ready = true;
        }
    }, 4500);
});

gameBox.addEventListener("click", (e) =>{
    if(ready){
        /********************************************** */
        /*Lógica de completar las parejas haciendo click*/
        /********************************************** */
        //Si el crono no se ha iniciado, lo iniciamos.
        if(crono[0].textContent === "00" && crono[1].textContent === "00" && crono[2].textContent === "00"){
            const firstTime = new Date().getTime();
            interval = setInterval(() => {
                printTime(firstTime);
            }, 100);
        }

        //registrar últimos clicks (quiero registrar la carta, no la cara, que es donde pincho, por eso parentElement)
        e.target.classList.contains("front") ? cardClicks.unshift(e.target.parentElement) : "";

        //Chequeamos: Existe click previo, el click previo contiene .showCard, no es de una pareja completada y el click actual no ha sido en el mismo sitio que el anterior.
        if(
            cardClicks.length > 1 &&
            cardClicks[1].classList.contains("showCard") && 
            !cardClicks[0].classList.contains("completed") &&
            !cardClicks[1].classList.contains("completed") && 
            cardClicks[0] !== cardClicks[1]
            ){
            // Y si además de todo eso, hace pareja:
            /*if(cardClicks[1].children[1].textContent == cardClicks[0].children[1].textContent){ */ 
            if(cardClicks[1].children[1].dataset.pokeNum == cardClicks[0].children[1].dataset.pokeNum){
                cardClicks[0].classList.add("showCard");
                cardClicks[0].classList.add("completed");
                cardClicks[1].classList.add("completed");
                //Comprobación de si están todas las parejas completadas
                if(gameEnded(allCards)){
                    playBtn.textContent = "Jugar de nuevo";
                    clearInterval(interval);
                }

            }else{
                // Pero si no hace pareja, comprobamos que el click anterior fue sobre una carta y no otro sitio (si es otro sitio, hacemos que el click actual valga como si fuera el pasado) y si efectivamente se hizo click en una carta pero que no ha hecho pareja, añadimos .showcard para que el usuario vea que ha pinchado en una carta mala, luego quitamos .showCard, y ponemos .hidecard para volverlas a esconder. Todo con timers para que la animación de las cartas sea correcta y se vuelvan las cartas a girar.
                if(!cardClicks[0].classList.contains("card")){
                    cardClicks[0] = cardClicks[1];
                }else{
                    ready = false;
                    cardClicks[1].classList.add("showCard");
                    cardClicks[0].classList.add("showCard");
                    setTimeout(() => {
                        cardClicks[1].classList.remove("showCard");
                        cardClicks[0].classList.remove("showCard");
                        cardClicks[1].classList.add("hideCard");
                        cardClicks[0].classList.add("hideCard");
                    }, 500);
                    setTimeout(() => {
                        cardClicks[1].classList.remove("hideCard");
                        cardClicks[0].classList.remove("hideCard");
                        ready = true;
                    }, 1500); 
                }
            }
        }else{
            // Venimos aqui porque anterior click NO contiene showCard, o al menos no es de una pareja completada y de paso comprobamos que hemos clickado sobre una carta y no sobre otra cosa, ahí entonces volteamos la primera carta.
            cardClicks[0].classList.contains("card") && !cardClicks[0].classList.contains("completed") ? cardClicks[0].classList.add("showCard") : "";

            //si se registra un click en una pareja completada hacemos que el último click quede registrado como la carta volteada y no sobre la carta completada que hemos hecho click.
            cardClicks[0].classList.contains("completed") ? cardClicks[0] = cardClicks[1] : "";
        }
    }
});