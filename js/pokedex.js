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

const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

let limit = 20;
let offset = 0;

const getPokemons = async () => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
    const data = await response.json();
    return data.results;
};

const createPokemonCard = (pokemon) => {
    const card = document.createElement('div');
    card.classList.add('pokemonCard');

    const name = document.createElement('h2');
    name.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    card.appendChild(name);

    const pokemonId = document.createElement('p');
    pokemonId.textContent = `#${pokemon.id.toString().padStart(3, '0')}`;
    card.appendChild(pokemonId);

    const image = document.createElement('img');
    image.dataset.src = pokemon.sprites.front_default;
    image.alt = `${pokemon.name} image`;
    image.classList.add('cardImage');
    card.appendChild(image);
    
    const types = document.createElement('ul');
    types.classList.add('cardTypes');
    pokemon.types.forEach((type) => {
        const typeImg = document.createElement('img');
        typeImg.src = typeImages[type.type.name];
        types.appendChild(typeImg);
    });
    card.appendChild(types);

    const firstType = pokemon.types[0].type.name;
    const rgbColor = hexToRgb(typeColors[firstType]);
    card.style.borderColor = typeColors[firstType];
    card.style.backgroundColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.7)`;

    return card;
}

document.addEventListener('DOMContentLoaded', () => {
    const loadMorePokemons = async () => {
        const pokemons = await getPokemons();
        pokemons.forEach(createPokemonCard);
        offset += limit;
      };
      

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            loadMorePokemons();
            observer.disconnect();
          }
        });
      });

      observer.observe(document.querySelector('#loading'));
      
      loadMorePokemons();
  });

const searchInput = document.getElementById('search');
const select = document.getElementById('filter');
const allTypes = document.getElementById("allTypes").value;

searchInput.addEventListener('keyup', (event) => {
    const searchString = event.target.value.toLowerCase();
    const filteredPokemons = allPokemons.filter((pokemon) => {
        return pokemon.name.toLowerCase().includes(searchString);
    });
    displayPokemons(filteredPokemons);
    select.value = allTypes;
});

select.addEventListener('change', (event) => {
    const selectedType = event.target.value;
    const allTypes = document.getElementById("allTypes").value;
    if (selectedType === allTypes) {
        displayPokemons(allPokemons);
    } else {
        const filteredPokemons = allPokemons.filter((pokemon) => pokemon.types.map((type) => type.type.name).includes(selectedType));
        displayPokemons(filteredPokemons);
    }
});

fetch('https://pokeapi.co/api/v2/type')
    .then((response) => response.json())
    .then((data) => {
        const types = data.results.map((type) => type.name);
        const select = document.getElementById('filter');

        types.forEach((type) => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
            select.appendChild(option);
        });
        select.removeChild(select.lastChild);
        select.removeChild(select.lastChild);
    });

let allPokemons = [];

fetch('https://pokeapi.co/api/v2/pokemon?limit=1302')
    .then((response) => response.json())
    .then((data) => {
        const fetchPromises = data.results.map((pokemon) => fetch(pokemon.url).then((response) => response.json()));
        Promise.all(fetchPromises)
            .then((pokemons) => {
                pokemons.sort((a, b) => a.id - b.id);
                allPokemons = pokemons;
                displayPokemons(pokemons);
            });
    });

function displayPokemons(pokemons) {
    const list = document.querySelector('.pokemonList');
    list.innerHTML = '';
    pokemons.forEach((pokemon) => {
        const card = createPokemonCard(pokemon);
        list.appendChild(card);
    });

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {  
            if (entry.isIntersecting) {
                const img = entry.target.querySelector('img');
                img.src = img.dataset.src;
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px 200px 0px' });

    const cards = document.querySelectorAll('.pokemonCard');
    cards.forEach(card => {
        observer.observe(card);
        const image = card.querySelector('.cardImage');
        card.addEventListener('mouseover', () => {
            image.classList.add('bounce');
        });
        card.addEventListener('mouseout', () => {
            image.classList.remove('bounce');
        });
        card.addEventListener('click', () => {
            const pokemonIdText = card.querySelector('p').innerText;
            const pokemonId = parseInt(pokemonIdText.replace('#', ''), 10);
            console.log(pokemonId);
            const selectedPokemon = allPokemons.find(pokemon => pokemon.id === pokemonId);
            console.log(selectedPokemon);
            localStorage.setItem('selectedPokemon', JSON.stringify(selectedPokemon));
            window.location.href = 'pokemon.html';
        });
    });
}
