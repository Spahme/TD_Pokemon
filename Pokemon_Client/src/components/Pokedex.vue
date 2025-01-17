<template>
  <div class="Pokedex">
    <h2>Pokemon List</h2>
      <div class="Pokedex-table">
        <div v-for="pokemon in pokemons" :key="pokemon.name">
          <li>{{ pokemon.name }}</li>
          <img :src="pokemon.url_image" alt="Image de {{ pokemon.name }}">
        </div>
    </div>
    <div v-if="error" class="error">{{ error }}</div> 
    <div class="pagination">    
      <button @click="fetchPreviousPage">Previous</button>
      <div>{{currentPage}}</div>
      <button @click="fetchNextPage">Next</button></div>
  </div>
</template>

<script>
import { Pokedex } from '@/services/httpClient.js';

export default {
  name: 'Pokedex',
  data() {
    return {
      pokemons: [],
      currentPage: 0,
      error: null,
      perPage: 20,
    };
  },
  methods: {
    async fetchPokedex() {
      try {
        const response = await Pokedex(this.perPage, this.currentPage);
        this.pokemons = response.results;
        this.error = null;
      } catch (error) {
        console.error('Erreur lors de la récupération des Pokémon :', error);
        this.error = 'Une erreur est survenue lors de la récupération des Pokémon.';
      }
    },
    fetchPreviousPage() {
      if (this.currentPage > 0) { // Correction : la page 0 est valide
        this.currentPage--;
        this.Pokedex();
      }
    },
    fetchNextPage() {
      if (this.currentPage < 34) { // Limite fixée à 34 pages
        this.currentPage++;
        this.Pokedex();
      }
    },
  },
  mounted() {
    // Utilisation du hook mounted pour appeler fetchPokemonList au chargement
    this.Pokedex();
  },
};
</script>


<style scoped>
.Pokemon_list_template {
  max-width: 600px;
  margin: 2rem auto;
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.Pokemon_list_template h2 {
  text-align: center;
  color: #0288d1;
  margin-bottom: 1rem;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  border-bottom: 1px solid #ccc;
}


.Pokemon_list_template div {
  margin-bottom: 1rem;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.pagination button {
  background-color: #81d4fa;
  color: #01579b;
  border: none;
  padding: 0.8rem 1.2rem;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.pagination button:hover {
  background-color: #4fc3f7;
}

.pagination div {
  font-size: 1.2rem;
  color: #01579b;
}

</style>