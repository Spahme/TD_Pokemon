<template>
  <div class="Poke_Search_Templates">
    <div id="search-bar">
      <label for="search" class="search-label">Search Pokémon:</label>
      <div class="search-container">
        <input
          type="text"
          v-model="search"
          @input="debouncedFn"
          @keydown.down.prevent="navigateResults('down')"
          @keydown.up.prevent="navigateResults('up')"
          @keydown.enter.prevent="selectHighlightedResult"
          placeholder="Name"
          class="search-input"
        />
        <div class="search-results" v-if="filteredResults.length">
          <div
            v-for="(result, index) in filteredResults"
            :key="result.name"
            :class="['search-result-item', { highlighted: index === highlightedIndex }]"
            @click="selectPokemon(result.name)"
          >
            {{ result.name }}
          </div>
        </div>
      </div>
      <div v-if="error" class="error">{{ error }}</div>
    </div>


    <div class="pokemon-card" v-if="pokemon">
      <h2 class="pokemon-name">{{ pokemon.name }}</h2>
      <p class="pokemon-id">ID: {{ pokemon.id }}</p>
      <img :src="pokemon.sprites.front_default" class="pokemon-image" alt="Pokémon image" />
      <ul class="pokemon-types">
        <li>{{ pokemon.type1 }}</li>
        <li v-if="pokemon.type2">{{ pokemon.type2 }}</li>
      </ul>
      <p class="pokemon-price">price: {{ pokemon.price.default }} $</p>
      <div id="more">      
        <button id="shiny" @click="toggleShiny">Shiny: {{ isShiny ? 'On' : 'Off' }}</button>
        <div id="stats">
            <span v-if="pokemon.stats" class="tooltip"><img src="../assets/tooltips.svg" alt="info" width="20px" height="20px">
            <span class="tooltiptext">{{ pokemon.stats }}</span>
          </span>
        </div>
      </div>
      <div class="add-button">Acheter</div>
    </div>
  </div>
</template>

<script>
import { PokemonSearch, fetchPokemonNames } from "@/services/httpClient.js";
import { useDebounceFn } from "@vueuse/core";

export default {
  name: "PokeSearch",
  data() {
    return {
      search: "",
      pokemon: null,
      error: null,
      isLoading: false, // État de chargement
      previousSearch: [],
      allPokemon: [],
      filteredResults: [],
      isShiny: false, // Toggle for shiny sprite
      highlightedIndex: -1, // Index de l'élément surligné
    };
  },
  methods: {
    async fetchAllPokemon() {
      this.isLoading = true; // Début du chargement
      try {
        const response = await fetchPokemonNames();
        this.allPokemon = response.results;
      } catch (err) {
        this.error = "Failed to load Pokémon names. Please try again.";
        console.error("Failed to fetch Pokémon names:", err);
      } finally {
        this.isLoading = false; // Fin du chargement
      }
    },
    async onSearchInput() {
      if (!this.search) {
        this.filteredResults = [];
        this.pokemon = null;
        this.error = null;
        this.highlightedIndex = -1;
        return;
      }
      if (this.previousSearch.includes(this.search)) {
        return;
      }
      this.filteredResults = this.allPokemon.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(this.search.toLowerCase())
      );
      this.highlightedIndex = 0;
    },
    navigateResults(direction) {
      if (!this.filteredResults.length) return;
      if (direction === 'down') {
        this.highlightedIndex = (this.highlightedIndex + 1) % this.filteredResults.length;
      } else if (direction === 'up') {
        this.highlightedIndex = (this.highlightedIndex - 1 + this.filteredResults.length) % this.filteredResults.length;
      }
    },
    selectHighlightedResult() {
      if (this.highlightedIndex >= 0 && this.highlightedIndex < this.filteredResults.length) {
        this.selectPokemon(this.filteredResults[this.highlightedIndex].name);
      }
    },
    async selectPokemon(name) {
      this.search = name;
      this.filteredResults = [];
      this.highlightedIndex = -1;
      this.isLoading = true; // Début du chargement
      try {
        const response = await PokemonSearch(name);
        this.pokemon = {
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
          stats: response.stats.map((stat) => `${stat.stat.name}: ${stat.base_stat}`).join(", "),
        };
        this.error = null;
      } catch (err) {
        this.pokemon = null;
        this.error = "Pokémon not found. Please check the name or ID.";
      } finally {
        this.isLoading = false; // Fin du chargement
      }
    },
    toggleShiny() {
      this.isShiny = !this.isShiny;
      if (this.isShiny === true) {
        document.getElementsByClassName("pokemon-image")[0].src = this.pokemon.sprites.shiny;
        document.getElementsByClassName("pokemon-price")[0].textContent = `price: ${this.pokemon.price.shiny} $`;
      } else {
        document.getElementsByClassName("pokemon-image")[0].src = this.pokemon.sprites.front_default;
        document.getElementsByClassName("pokemon-price")[0].textContent = `price: ${this.pokemon.price.default} $`;
      }
    },
  },
  mounted() {
    this.debouncedFn = useDebounceFn(this.onSearchInput, 300);
    this.fetchAllPokemon();
  },
};
</script>


<style scoped>
/* Global Styles */
.Poke_Search_Templates {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
  font-family: 'Roboto', sans-serif;
  color: #333;
  text-align: center;
  background-color: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

}
/* Pokémon Card */
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

.pokemon-price {
  font-size: 1rem;
  color: #555;
  margin: 10px 0;
}

/* Pokémon Types */
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

/* Tooltip for Stats */
#stats {
  position: relative;
  display: inline-block;
}

.tooltip {
  cursor: pointer;
  color: #007bff;
  font-size: 1.2rem;
}

.tooltiptext {
  visibility: hidden;
  width: 200px;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 5px;
  padding: 5px 10px;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -100px;
  opacity: 0;
  transition: opacity 0.3s;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}

/* Buttons */
#more {
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
}

#more button,
.add-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  font-size: 1rem;
  cursor: pointer;
}

#more button:hover,
.add-button:hover {
  background-color: #0056b3;
}

/* Error Messages */
.error {
  margin-top: 1rem;
  color: #d32f2f;
  font-weight: bold;
  text-align: center;
}
/* Search Bar Styles */
#search-bar {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.search-label {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

.search-container {
  display: flex;
  gap: 0.5rem;
}

.search-input {
  flex: 1;
  padding: 0.8rem;
  border: 1px solid #cfd8dc;
  border-radius: 5px;
  font-size: 1rem;
}

.search-input:focus {
  outline: none;
  border-color: #4fc3f7;
  box-shadow: 0 0 5px rgba(79, 195, 247, 0.5);
}

.search-button {
  padding: 0.8rem;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  font-size: 1rem;
}

.search-button:hover {
  background-color: #0056b3;
}

/* Search Results */
.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #cfd8dc;
  border-radius: 5px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
}

.search-result-item {
  padding: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s;
  text-align: left;

}

.search-result-item:hover,
.search-result-item.highlighted {
  background-color: #f1f1f1;
  font-weight: bold;
}

/* Error Messages */
.error {
  margin-top: 1rem;
  color: #d32f2f;
  font-weight: bold;
  text-align: center;
}
</style>