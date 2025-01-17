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
    <div v-if="pokemon">
      <h2>{{ pokemon.name }}</h2>
      <p>ID: {{ pokemon.id }}</p>
      <img :src="pokemon.sprites.front_default" alt="Pokémon image" />
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
        };
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

</style>
