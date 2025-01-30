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
      <div class="pokemon-card" @click.stop>
      <h2 class="pokemon-name">{{ PokemonDetail.name }}</h2>
      <p class="pokemon-id">ID: {{ PokemonDetail.id }}</p>
      <img :src="PokemonDetail.sprites.front_default" class="pokemon-image" alt="Pokémon image" />
      <ul class="pokemon-types">
        <li>{{ PokemonDetail.type1 }}</li>
        <li v-if="PokemonDetail.type2">{{ PokemonDetail.type2 }}</li>
      </ul>
      <p class="pokemon-price">price: {{ PokemonDetail.price.default }} $</p>
      <div id="more">      
        <button id="shiny" @click="toggleShiny">Shiny: {{ isShiny ? 'On' : 'Off' }}</button>
        <div id="stats">
          <span v-if="PokemonDetail.stats" class="tooltip">
            <img src="../assets/tooltips.svg" alt="info" width="20px" height="20px" />
            <ul class="tooltiptext">
              <li><strong>Base Stats:</strong></li>
              <li v-for="(stat, index) in PokemonDetail.stats" :key="index">
                {{ stat.name }}: {{ stat.base_stat }}
              </li>
            </ul>
          </span>
        </div>
      </div>
        <div class="add-button" @click="buy(pokemon.id, this.isShiny)">Acheter</div>

      </div>
    </div>
  </div>
</template>

<script>
import { fetchPokemon, PokemonSearch } from '@/services/httpClient.js';

export default {
  name: 'PokemonList',
  data() {
    return {
      pokemons: [],
      types: [],
      currentPage: 0,
      error: null,
      perPage: 30,
      PokemonDetail: null,
      showDetail: false,
      filter: 'null',
      isShiny: false,
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
    toggleShiny() {
      this.isShiny = !this.isShiny;
      if (this.isShiny === true) {
        document.getElementsByClassName("pokemon-image")[0].src = this.PokemonDetail.sprites.shiny;
        document.getElementsByClassName("pokemon-price")[0].textContent = `price: ${this.PokemonDetail.price.shiny} $`;
      } else {
        document.getElementsByClassName("pokemon-image")[0].src = this.PokemonDetail.sprites.front_default;
        document.getElementsByClassName("pokemon-price")[0].textContent = `price: ${this.PokemonDetail.price.default} $`;
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
            shiny: response.sprites.front_shiny,
          },
          price: {
            default: response.base_experience,
            shiny: response.base_experience * 2,
          },
          type1: response.types[0].type.name,
          type2: response.types[1] ? response.types[1].type.name : null,
          stats: response.stats.map((stat) => ({
            name: stat.stat.name,
            base_stat: stat.base_stat,
          })),

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
      if (this.pokemons.length < 43) {
        this.currentPage++;
        this.fetchPokemon();      
      }
    },
    async fetchType (){
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
    buy(id, shiny) {
      console.log(`Achat du Pokémon ${id} ${shiny}`);
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
  margin-bottom: 1rem;
  padding: 1rem;
}

.Pokemon_list ul {
  list-style-type: none;
  padding: 0;
  margin-left: 2rem;
}

.Pokemon_list li {
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


</style>