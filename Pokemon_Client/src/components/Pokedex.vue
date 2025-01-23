<template>
  <div class="Pokemon_list_template">
    <h2>Pokemon List</h2>
    <div v-if="error" class="error">{{ error }}</div>
    <div id="filter">
      <select v-model="selectedType1" id="type1" class="type-select">
        <option value="">Type 1</option>
        <option v-for="type in types" :key="type" :value="type">
          {{ type }}
        </option>
      </select>
      <!-- apparait que si type 1 est remplie-->
      <select v-model="selectedType2" id="type2" class="type-select" :disabled="!selectedType1">
        <option value="">Type 2</option>
        <option v-for="type in types" :key="type" :value="type">
          {{ type }}
        </option>
      </select>
    </div>
    <div class="Pokedex-table">
      <div v-for="pokemon in filteredPokemons" :key="pokemon.id" class="pokemon-card">
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
import { fetchPokemon, PokemonDetail, fetchType } from '@/services/httpClient.js';

export default {
  name: 'Pokedex',
  data() {
    return {
      pokemons: [],
      currentPage: 0,
      error: null,
      perPage: 18,
      types: [],
      selectedType1: '',
      selectedType2: '',
    };
  },
  computed: {
    filteredPokemons() {
      return this.pokemons.filter(pokemon => {
        const type1Match = this.selectedType1 ? pokemon.types.some(type => type.type.name === this.selectedType1) : true;
        const type2Match = this.selectedType2 ? pokemon.types.some(type => type.type.name === this.selectedType2) : true;
        if (pokemon > this.perPage){
          fetchPokemon();
          return type1Match && type2Match;
        }
        return type1Match && type2Match;
      });
    }
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
    async fetchTypes() {
      try {
        for (let i = 1; i < 19; i++) {
          const response = await fetchType(i);
          this.types.push(response.name);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des types :', error);
        this.error = 'Une erreur est survenue lors de la récupération des types.';
      }
    },
  },
  mounted() {
    this.fetchPokemon();
    this.fetchTypes();
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
/* Styles for the select elements */
#filter {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.type-select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
  font-size: 1rem;
  color: #333;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-repeat: no-repeat;
  background-position: right 10px center;
  transition: border-color 0.3s ease;
}

.type-select:focus {
  border-color: #0288d1;
  outline: none;
}

.type-select:disabled {
  background-color: #f0f0f0;
  color: #999;
  cursor: not-allowed;
}
</style>
