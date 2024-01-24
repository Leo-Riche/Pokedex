const typeColors = {
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    dark: '#705746',
    steel: '#B7B7CE',
    fairy: '#D685AD',
};

const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

const createPokemonCard = (pokemon) => {
    const card = document.createElement('div');
    card.classList.add('pokemonCard');

    const name = document.createElement('h2');
    name.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    card.appendChild(name);

    const image = document.createElement('img');
    image.src = pokemon.sprites.front_default;
    card.appendChild(image);

    const types = document.createElement('ul');
    pokemon.types.forEach((type) => {
        const typeLi = document.createElement('li');
        typeLi.textContent = type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1);
        typeLi.style.backgroundColor = typeColors[type.type.name];
        types.appendChild(typeLi);
    });
    card.appendChild(types);

    const firstType = pokemon.types[0].type.name;
    const rgbColor = hexToRgb(typeColors[firstType]);
    card.style.borderColor = typeColors[firstType];
    card.style.backgroundColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.7)`;

    return card;
}

fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
    .then((response) => response.json())
    .then((data) => {
        const fetchPromises = data.results.map((pokemon) => fetch(pokemon.url).then((response) => response.json()));
        Promise.all(fetchPromises)
            .then((pokemons) => {
                pokemons.sort((a, b) => a.id - b.id);
                const list = document.querySelector('.pokemonList');
                pokemons.forEach((pokemon) => {
                    const card = createPokemonCard(pokemon);
                    list.appendChild(card);
                });
            });
    });