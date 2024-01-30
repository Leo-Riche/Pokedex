const pokemon = localStorage.getItem('product_id');

fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
    .then((response) => response.json())
    .then((pokemon) => {
        // const pokemonPage = document.querySelector('.pokemonPage');
        
        // const name = document.createElement('h1');
        // name.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
        
        // const pokemonTextId = document.createElement('p');
        // pokemonTextId.textContent = `#${pokemon.id.toString().padStart(3, '0')}`;

        // pokemonPage.appendChild(name);
        // pokemonPage.appendChild(pokemonTextId);
    });