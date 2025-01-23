<template>
  <div class="Pokemon_list_template">
    <h2>Pokemon List</h2>
    <div v-if="error" class="error">{{ error }}</div>
    <div class="Pokedex-table">
      <div v-for="pokemon in pokemons" :key="pokemon.id" class="pokemon-card">
        <p class="pokemon-name">{{ pokemon.name }}</p>
        <img :src="pokemon.url_image" :alt="pokemon.name" class="pokemon-image" />
        <ul class="pokemon-types">
          <li v-for="(type, index) in pokemon.types" :key="index" class="type">{{ type.type.name }}</li>
        </ul>     
        <p class="pokemon-experience">{{ pokemon.base_experience }}$</p>
        <div class="add-button">Acheter</div>
      </div>
    </div>
    <div class="pagination">
      <button @click="fetchPreviousPage" :disabled="currentPage === 0">Previous</button>
      <div>{{ currentPage + 1 }}</div>
      <button @click="fetchNextPage">Next</button>
    </div>
  </div>
</template>

<script>
import { fetchPokemon, PokemonDetail } from '@/services/httpClient.js'; // Vérifiez vos importations

export default {
  name: 'Pokedex',
  data() {
    return {
      pokemons: [],
      currentPage: 0,
      error: null,
      perPage: 18,
    };
  },
  methods: {
    async fetchPokemon() {
      try {
        const offset = this.currentPage * this.perPage;
        const response = await fetchPokemon(this.perPage, offset);
        this.pokemons = response.results;
        this.error = null;

        const detailPromises = this.pokemons.map(async (pokemon) => {
          const response2 = await PokemonDetail(pokemon.url);
          pokemon.url_image = response2.sprites.front_default;
          pokemon.id = response2.id;
          pokemon.base_experience = response2.base_experience;
          pokemon.types = response2.types;
          pokemon.type1 = response2.types[0].type.name;
          pokemon.type2 = response2.types[1] ? response2.types[1].type.name : null;
        });

        await Promise.all(detailPromises);
      } catch (error) {
        console.error('Erreur lors de la récupération des Pokémon :', error);
        this.error = 'Une erreur est survenue lors de la récupération des Pokémon.';
      } finally {
        document.querySelector('.Pokedex-table').scrollTop = 0;
      }
    },
    fetchPreviousPage() {
      if (this.currentPage > 0) {
        this.currentPage--;
        this.fetchPokemon();
      }
    },
    fetchNextPage() {
      if (this.currentPage < 40) {
        this.currentPage++;
        this.fetchPokemon();
      }
    },
  },
  mounted() {
    this.fetchPokemon();
  },
};
</script>

<style scoped>
.Pokedex {
  max-width: 600px;
  margin: 2rem auto;
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.Pokedex h2 {
  text-align: center;
  color: #0288d1;
  margin-bottom: 1rem;
}

.Pokedex-table {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  padding: 20px;
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

.error {
  color: red;
  text-align: center;
  margin-top: 1rem;
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

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination div {
  font-size: 1.2rem;
  color: #01579b;
}
.pokemon-types ul {
  list-style-type: none;
  padding: 0;
  margin: 0 auto;
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
</style>
