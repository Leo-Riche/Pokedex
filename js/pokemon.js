const typeColors = {
    normal: {r: 168, g: 168, b: 120},
    fire: {r: 240, g: 128, b: 48},
    water: {r: 99, g: 144, b: 240},
    electric: {r: 247, g: 208, b: 44},
    grass: {r: 122, g: 199, b: 76},
    ice: {r: 150, g: 217, b: 214},
    fighting: {r: 194, g: 46, b: 40},
    poison: {r: 163, g: 62, b: 161},
    ground: {r: 226, g: 191, b: 101},
    flying: {r: 169, g: 143, b: 243},
    psychic: {r: 249, g: 85, b: 135},
    bug: {r: 166, g: 185, b: 26},
    rock: {r: 182, g: 161, b: 54},
    ghost: {r: 115, g: 87, b: 151},
    dragon: {r: 111, g: 53, b: 252},
    dark: {r: 112, g: 87, b: 70},
    steel: {r: 183, g: 183, b: 206},
    fairy: {r: 214, g: 133, b: 173},
};

const typeImages = {
    normal: 'img/types/normal.png',
    fire: 'img/types/fire.png',
    water: 'img/types/water.png',
    electric: 'img/types/electric.png',
    grass: 'img/types/grass.png',
    ice: 'img/types/ice.png',
    fighting: 'img/types/fighting.png',
    poison: 'img/types/poison.png',
    ground: 'img/types/ground.png',
    flying: 'img/types/flying.png',
    psychic: 'img/types/psychic.png',
    bug: 'img/types/bug.png',
    rock: 'img/types/rock.png',
    ghost: 'img/types/ghost.png',
    dragon: 'img/types/dragon.png',
    dark: 'img/types/dark.png',
    steel: 'img/types/steel.png',
    fairy: 'img/types/fairy.png',
};

window.onload = function() {
    const storedData = localStorage.getItem('selectedPokemon');
    const selectedPokemon = JSON.parse(storedData);
    
    const pokemonName = document.getElementById('name');
    pokemonName.innerText = selectedPokemon.name.charAt(0).toUpperCase() + selectedPokemon.name.slice(1);

    const pokemonId = document.getElementById('id');
    pokemonId.textContent = `#${selectedPokemon.id.toString().padStart(3, '0')}`;

    const image = document.getElementById('img');
    image.src = selectedPokemon.sprites.front_default;
    image.alt = `${selectedPokemon.name} image`;

    const imageFront = document.getElementById('imgFront');
    imageFront.src = selectedPokemon.sprites.front_default;
    imageFront.alt = `${selectedPokemon.name} image`;

    const imageBack = document.getElementById('imgBack');
    imageBack.src = selectedPokemon.sprites.back_default;
    imageBack.alt = `${selectedPokemon.name} image`;

    const imageShiny = document.getElementById('imgShiny');
    imageShiny.src = selectedPokemon.sprites.front_shiny;
    imageShiny.alt = `${selectedPokemon.name} image`;

    const imageShinyBack = document.getElementById('imgShinyBack');
    imageShinyBack.src = selectedPokemon.sprites.back_shiny;
    imageShinyBack.alt = `${selectedPokemon.name} image`;

    const images = [document.getElementById('img'), document.getElementById("imgFront"), document.getElementById('imgBack'), document.getElementById('imgShiny'), document.getElementById('imgShinyBack')];

    images.forEach((image) => {
        image.addEventListener('click', () => {
            images[0].src = image.src;
        });
    });

    const types = document.getElementById('types');
    selectedPokemon.types.forEach((type) => {
        const typeImg = document.createElement('img');
        typeImg.src = typeImages[type.type.name];
        typeImg.alt = `${type.type.name} type`;
        types.appendChild(typeImg);
    });

    const abilities = document.getElementById('abilities');
    selectedPokemon.abilities.forEach((ability) => {
        const abilityName = document.createElement('li');
        abilityName.textContent = ability.ability.name.charAt(0).toUpperCase() + ability.ability.name.slice(1);
        abilities.appendChild(abilityName);
    });

    const stats = document.getElementById('stats');
    selectedPokemon.stats.forEach((stat) => {
        const statName = document.createElement('li');
        statName.textContent = stat.stat.name.charAt(0).toUpperCase() + stat.stat.name.slice(1) + " : " + stat.base_stat;
        stats.appendChild(statName);
    });

    async function getEvolution() {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${selectedPokemon.id}/`);
        const species = await response.json();
        const evolutionResponse = await fetch(species.evolution_chain.url);
        const evolutionChain = await evolutionResponse.json();
        let evolutionName, evolutionId;
        if ((evolutionChain.chain.evolves_to[0] || evolutionChain.chain.evolves_to[0].evolves_to[0]) && (evolutionChain.chain.evolves_to[0].species.name != selectedPokemon.name || evolutionChain.chain.evolves_to[0].evolves_to[0].species.name != selectedPokemon.name)) {
            if (evolutionChain.chain.species.name === selectedPokemon.name) {
                evolutionName = evolutionChain.chain.evolves_to[0].species.name;
                evolutionId = evolutionChain.chain.evolves_to[0].species.url.split("/")[6];
            } else if (evolutionChain.chain.evolves_to[0].species.name === selectedPokemon.name) {
                evolutionName = evolutionChain.chain.evolves_to[0].evolves_to[0].species.name;
                evolutionId = evolutionChain.chain.evolves_to[0].evolves_to[0].species.url.split("/")[6];
            } else {
                evolutionName = "No further evolution";
            }
        } else {
            evolutionName = "No further evolution";
        }
        const evolutionElement = document.getElementById('evolution');
        
        evolutionElement.textContent = evolutionName.charAt(0).toUpperCase() + evolutionName.slice(1);  
        
        evolutionElement.addEventListener('click', () => {
            if (evolutionElement.textContent != "No further evolution") {
                fetch(`https://pokeapi.co/api/v2/pokemon/${evolutionId}`)
                    .then((response) => response.json())
                    .then((data) => {
                        localStorage.setItem('selectedPokemon', JSON.stringify(data));
                        window.location.href = "pokemon.html";
                    });
            }

        });
        
    }

    getEvolution();
}
