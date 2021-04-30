const gameBox = document.getElementById("game");
const allCards = document.querySelectorAll(".card");
allCards.length %2 !== 0 ? alert("Numero de cartas introducido en HTML es impar") : "";

/*Lógica de la colocación de las tarjetas*/
//Función pone las parejas de pokemons aleatoriamente en las cartas del DOM (pide por parametro el numero de cartas que hay en html)
const getRandomPokemon = (cards) => {

    //Traemos la mitad de pokemons aleatorios que cartas hay en html sin que se repita ninguno
    let randomPokemons = [];
    while(randomPokemons.length < cards / 2){
        let random = Math.floor((Math.random() * (151 - 1 + 1)) + 1);
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
        allCards[randomPositions[i]].textContent = randomPokemons[count];
        i %2 !== 0 ? count++ : "";
    }
}
getRandomPokemon(allCards.length);

/*Lógica de completar las parejas haciendo click*/
const cardClicks = [];
gameBox.addEventListener("click", (e) =>{
    //registrar últimos clicks
    cardClicks.unshift(e.target);
    //si se registra un click sobre una pareja completada
    cardClicks[0].classList.contains("completed") ? cardClicks[0] = cardClicks[1] : "";  
    if(cardClicks.length > 1 && cardClicks[1].classList.contains("selected") && !cardClicks[1].classList.contains("completed") && cardClicks[0] !== cardClicks[1]){
        // el anterior click contiene selected, no es una pareja completada y no fue sobre esta misma carta
        if(cardClicks[1].textContent == cardClicks[0].textContent){
            // Y además hace pareja
            cardClicks[0].classList.add("selected");
            cardClicks[0].classList.add("completed");
            cardClicks[1].classList.add("completed");
        }else{
            // Pero no es una pareja correcta 
            cardClicks[1].classList.remove("selected");
        }
    }else{
        // El anterior click NO contiene selected, o al menos no es de una pareja completada
        cardClicks[0].classList.add("selected");
    }
});