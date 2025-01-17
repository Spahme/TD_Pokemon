<template>
  <div class="Pokemon_list_template">
    <h2>Pokemon List</h2>
    <div class="Pokemon_list">
          <ul v-for="pokemon in pokemons" :key="pokemon.name">
            <li>{{ pokemon.name }}</li>
          </ul>
        <div v-if="error" class="error">{{ error }}</div> 
  </div>
  <div class="pagination">    
      <button @click="fetchPreviousPage">Previous</button>
      <div>{{currentPage}}</div>
      <button @click="fetchNextPage">Next</button></div>
    </div>
</template>

<script>
import { fetchPokemonList } from '@/services/httpClient.js';

export default {
  name: 'PokemonList',
  data() {
    return {
      pokemons: [],
      currentPage: 0,
      error: null,
      perPage: 30,
    };
  },
  methods: {
    async fetchPokemonList() {
      try {
        const response = await fetchPokemonList(this.perPage, this.currentPage);
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
        this.fetchPokemonList();
      }
    },
    fetchNextPage() {
      if (this.currentPage < 34) { // Limite fixée à 34 pages
        this.currentPage++;
        this.fetchPokemonList();
      }
    },
  },
  mounted() {
    // Utilisation du hook mounted pour appeler fetchPokemonList au chargement
    this.fetchPokemonList();
  },
};
</script>


<style scoped>
.Pokemon_list_template {
  max-width: 600px;
  margin: 2rem auto;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

}
.Pokemon_list {
  overflow-y: scroll; 
  height: 500px;
  padding: 0;
  margin: 0;
}
.Pokemon_list_template h2 {
  text-align: center;
  color: #0288d1;
  margin-bottom: 1rem;
  padding: 1rem;
}
ul {
  list-style-type: none;
  padding: 0;
  margin-left: 2rem;
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
  padding: 1rem;
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