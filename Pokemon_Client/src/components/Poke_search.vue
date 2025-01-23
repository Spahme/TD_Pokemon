<template>
  <div class="Poke_Search_Templates">
    <label for="search">Search:</label>
    <input
      id="search"
      type="text"
      v-model="search"
      @input="onSearchInput"
      placeholder="Enter Pokémon name or ID"
    />
    <div v-if="error" class="error">{{ error }}</div>
      <div class="pokemon-card" v-if="pokemon">
        <h2 class="pokemon-name">{{ pokemon.name }}</h2>
        <p class="pokemon-id">ID: {{ pokemon.id }}</p>
        <img :src="pokemon.sprites.front_default" class="pokemon-image" alt="Pokémon image" />
        <ul class="pokemon-types">
          <li> {{ pokemon.type1 }}</li>
          <li v-if="pokemon.type2"> {{ pokemon.type2 }}</li>
        </ul>      
        <p class="pokemon-experience">{{ pokemon.price }}</p>
        <div class="add-button">Acheter</div>
      </div>
  </div>
</template>

<script>
import { PokemonSearch } from '@/services/httpClient.js';


export default {
  name: 'PokeSearch',
  data: () => ({
    search: '',
    pokemon: null,
    error: null,
  }),
  methods: {
    async onSearchInput() {
      if (!this.search) {
        this.pokemon = null;
        this.error = null;
        return;
      }
      try {
        const response = await PokemonSearch(this.search);
        this.pokemon = {
          id: response.id,
          name: response.name,
          sprites: {
            front_default: response.sprites.front_default,
          },
          price: response.base_experience,
          type1: response.types[0].type.name,
          type2: response.types[1] ? response.types[1].type.name : null,
        };
        console.log(this.pokemon);
        this.error = null;
      } catch (err) {
        this.pokemon = null;
        this.error = 'Pokémon not found. Please check the name or ID.';
      }
    },
  },
};
</script>

<style>
.Poke_Search_Templates {
  max-width: 400px;
  margin: 2rem auto;
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.Poke_Search_Templates label {
  display: block;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.Poke_Search_Templates input {
  width: 90%;
  padding: 0.8rem;
  border: 1px solid #cfd8dc;
  border-radius: 5px;
  font-size: 1rem;
}

.Poke_Search_Templates input:focus {
  outline: none;
  border-color: #4fc3f7;
  box-shadow: 0 0 5px rgba(79, 195, 247, 0.5);
}

.Poke_Search_Templates h2 {
  margin-top: 1.5rem;
  color: #0277bd;
}

.error {
  margin-top: 1rem;
  color: #d32f2f;
  font-weight: bold;
  text-align: center;
}
.pokemon-card {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  width: 200px;
  text-align: center;
  padding: 15px;
  margin: 1rem auto;

}

.pokemon-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.pokemon-name {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 10px 0;
  color: #333;
}

.pokemon-image {
  max-width: 100%;
  height: auto;
  border-radius: 5px;
}

.pokemon-experience {
  font-size: 1rem;
  color: #555;
  margin: 10px 0;
}
.pokemon-types ul {
  list-style-type: none;
  padding: 0;
  margin: 0 10px;
}

.pokemon-types li {
  display: inline-block;
  background-color: #e0e0e0;
  border-radius: 5px;
  padding: 5px 10px;
  margin: 5px;
  font-size: 0.9rem;
  color: #333;
}
.add-button {
  background-color: #007bff;
  color: #fff;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-button:hover {
  background-color: #0056b3;
}

</style>
