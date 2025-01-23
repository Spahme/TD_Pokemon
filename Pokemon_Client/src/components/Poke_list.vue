<template>
  <div class="Pokemon_list_template">
    <h2>Pokemon List</h2>
    <div class="Pokemon_list">
      <ul>
        <li v-for="pokemon in pokemons" :key="pokemon.name" @click="showPokemonDetail(pokemon.name)">
          {{ pokemon.name }}
        </li>
      </ul>
    </div>
    <div v-if="error" class="error">{{ error }}</div>
    <div class="pagination">
      <button @click="fetchPreviousPage" :disabled="currentPage === 0">Previous</button>
      <div>{{ currentPage + 1 }}</div>
      <button @click="fetchNextPage">Next</button>
    </div>
    <div v-if="showDetail" class="popup" @click="closePopup">
      <div class="popup-content" @click.stop>
        <h2>{{ PokemonDetail.name }}</h2>
        <p>ID: {{ PokemonDetail.id }}</p>
        <img :src="PokemonDetail.sprites.front_default" alt="Pokémon image" />
        <ul>
          <li>{{ PokemonDetail.type1 }}</li>
          <li v-if="PokemonDetail.type2">{{ PokemonDetail.type2 }}</li>
        </ul>
        <p>{{ PokemonDetail.price }}</p>
        <div class="add-button">Acheter</div>
      </div>
    </div>
  </div>
</template>


<script>
import { fetchPokemon, PokemonDetail, PokemonSearch } from '@/services/httpClient.js';

export default {
  name: 'PokemonList',
  data() {
    return {
      pokemons: [],
      currentPage: 0,
      error: null,
      perPage: 30,
      PokemonDetail: null,
      showDetail: false,
    };
  },
  methods: {
    async fetchPokemon() {
      try {
        const offset = this.currentPage * this.perPage;
        const response = await fetchPokemon(this.perPage, offset);
        this.pokemons = response.results;
        this.error = null;
        document.querySelector('.Pokemon_list').scrollTop = 0;
      } catch (error) {
        console.error('Erreur lors de la récupération des Pokémon :', error);
        this.error = 'Une erreur est survenue lors de la récupération des Pokémon.';
      }
    },
    async showPokemonDetail(name) {
      try {
        const response = await PokemonSearch(name);
        this.PokemonDetail = {
          id: response.id,
          name: response.name,
          sprites: {
            front_default: response.sprites.front_default,
          },
          price: response.base_experience,
          type1: response.types[0].type.name,
          type2: response.types[1] ? response.types[1].type.name : null,
        };
        this.showDetail = true;
      } catch (error) {
        console.error('Erreur lors de la récupération des détails du Pokémon :', error);
        this.error = 'Une erreur est survenue lors de la récupération des détails du Pokémon.';
      }
    },
    closePopup() {
      this.showDetail = false;
      this.PokemonDetail = null;
    },
    fetchPreviousPage() {
      if (this.currentPage > 0) {
        this.currentPage--;
        this.fetchPokemon();
      }
    },
    fetchNextPage() {
      this.currentPage++;
      this.fetchPokemon();
    },
  },
  mounted() {
    this.fetchPokemon();
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
  cursor: pointer;
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

.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-content {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
  width: 300px;
}

.popup-content h2 {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 10px 0;
  color: #333;
}

.popup-content p {
  font-size: 1rem;
  color: #555;
  margin: 10px 0;
}

.popup-content img {
  max-width: 100%;
  height: auto;
  border-radius: 5px;
}

.popup-content ul {
  list-style-type: none;
  padding: 0;
  margin: 0 10px;
}

.popup-content li {
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
