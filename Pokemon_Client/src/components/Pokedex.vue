<template>
  <div class="Pokedex_template">
    <h2>Pokemon List</h2>
    <div v-if="error" class="error">{{ error }}</div>


    <div id="filter">
      <select v-model="selectedType1" id="type1" class="type-select" @change="fetchPokemon">
        <option value="">Type 1</option>
        <option v-for="type in types" :key="type" :value="type">
          {{ type }}
        </option>
      </select>
      <select
        v-model="selectedType2"
        id="type2"
        class="type-select"
        :disabled="!selectedType1"
        @change="fetchPokemon"
      >
        <option value="">Type 2</option>
        <option
          v-for="type in filteredTypesForSecond"
          :key="type"
          :value="type"
        >
          {{ type }}
        </option>
      </select>

      <button id="shiny" @click="toggleShiny">Shiny: {{ isShiny ? 'On' : 'Off' }}</button>
      <button @click="resetFilters">Reset</button>
    </div>
    <div class="Pokedex-table">
      <div v-if="isLoading" class="loading-bar">
        <div class="spinner"></div>
        <div class="timer">{{ loadingTime }}s|id:{{ actual_id }}</div>
      </div>
      <div v-for="pokemon in pokemons" :key="pokemon.id" class="pokemon-card">
        <p class="pokemon-name">{{ pokemon.name }} | {{ pokemon.id }}</p>
        <img :src="isShiny ? pokemon.url_image.shiny : pokemon.url_image.default" :alt="pokemon.name" class="pokemon-image" />
        <ul class="pokemon-types">
          <li v-for="(type, index) in pokemon.types" :key="index" class="type">
            {{ type.type.name }}
          </li>
        </ul>
        <div id="more">
        <p class="pokemon-price">Price: {{ isShiny ? pokemon.base_experience * 2 : pokemon.base_experience }} $</p>
          <div id="stats">
            <span v-if="pokemon.stats" class="tooltip">
              <img src="../assets/tooltips.svg" alt="info" width="20px" height="20px" />
              <ul class="tooltiptext">
                <li><strong>Base Stats:</strong></li>
                <li v-for="(stat, index) in pokemon.stats" :key="index">
                  {{ stat.name }}: {{ stat.base_stat }}
                </li>
              </ul>
            </span>
          </div>
        </div>
        <div class="add-button" @click="buy(pokemon.id, this.isShiny)">Acheter</div>
      </div>
    </div>
    <div class="pagination">
      <button id='prev' @click="fetchPreviousPage()" :disabled="currentPage === 0">Previous</button>
      <div>{{ currentPage + 1 }}</div>
      <button id='next' @click="fetchNextPage()">Next</button>
    </div>
  </div>
</template>

<script>
import { fetchPokemon, PokemonDetail, fetchType } from "@/services/httpClient.js";

export default {
  name: "Pokedex",
  data() {
    return {
      loadingTime: 0,
      load_timer: null,
      pokemons: [],
      currentPage: 0,
      error: null,
      isLoading: false, // Indicateur de chargement
      perPage: 18,
      types: [],
      selectedType1: "",
      selectedType2: "",
      isShiny: false, // Toggle shiny sprite
      Nbtest: 0, // Counter for test
      restarSearch: null, 
      lastOffset: null,
      Offset: 0,
      actual_id: 0,
      last_id: 0,
      first_id: 0,
    };
  },
  computed: {
    filteredPokemons() {
      let filtered = [...this.pokemons]; // Créer une copie du tableau pour éviter de modifier l'original

      // Filtrage par type
      filtered = filtered.filter((pokemon) => {
        const type1Match = this.selectedType1
          ? pokemon.types.some((type) => type.type.name === this.selectedType1)
          : true;
        const type2Match = this.selectedType2
          ? pokemon.types.some((type) => type.type.name === this.selectedType2)
          : true;
        return type1Match && type2Match;
      });

      return filtered;
    },
    paginatedPokemons() {
      // Pagination des Pokémon filtrés et triés
      const start = this.currentPage * this.perPage;
      const end = start + this.perPage;
      return this.filteredPokemons.slice(start, end);
    },
    startTimer() {
      this.loadingTime = 0;
      this.loadTimer = setInterval(() => {
        this.loadingTime++;
      }, 1000);
    },
    stopTimer() {
      console.log('load time = ' + this.loadingTime +"s");
      clearInterval(this.loadTimer);
      this.loadTimer = null;
    },
    filteredTypesForSecond() {
        // Retourne tous les types sauf celui sélectionné dans Type 1
        return this.types.filter(type => type !== this.selectedType1);
    },
  },
  methods: {
    async fetchPokemon() {

      try {
        this.lastOffset = this.first_id-1;
        this.isLoading = true;
        this.startTimer


        let detailedPokemons = [];
        this.pokemons = [];
        this.error = null;

        while (detailedPokemons.length < this.perPage) {
          const response = await fetchPokemon(this.perPage, this.Offset);
          if (!response.results.length) {
            break;
          }
          const detailPromises = response.results.map(async (pokemon) => {
            try {
              const response2 = await PokemonDetail(pokemon.url);
              this.Nbtest++;
              const matchesType1 = this.selectedType1
                ? response2.types.some((type) => type.type.name === this.selectedType1)
                : true;
              const matchesType2 = this.selectedType2
                ? response2.types.some((type) => type.type.name === this.selectedType2)
                : true;
              //console.log(response2.id + '|' + response2.name );
              this.actual_id = response2.id;
              if (matchesType1 && matchesType2) {
                return {
                  name: pokemon.name,
                  id : response2.id,
                  url_image: { 
                    default: response2.sprites.front_default,
                    shiny: response2.sprites.front_shiny 
                  },  
                  id: response2.id,
                  base_experience: response2.base_experience,
                  types: response2.types,
                  stats: response2.stats.map((stat) => ({
                    name: stat.stat.name,
                    base_stat: stat.base_stat,
                  })),

                };
              }
              return null;
            } catch (error) {
              console.error(`Erreur lors de la récupération des détails pour ${pokemon.name}:`, error);
              return null;
            }
          });

          const filteredResults = (await Promise.all(detailPromises)).filter(Boolean);
          detailedPokemons = [...detailedPokemons, ...filteredResults];

          //console.log('this.Offset = ' + this.Offset + ' | this.perPage = ' + this.perPage);
          this.Offset = this.Offset + this.perPage;


        }

        this.pokemons = detailedPokemons.slice(0, this.perPage);
      } catch (error) {
        console.error("Erreur lors de la récupération des Pokémon :", error);
        this.error = "Une erreur est survenue lors de la récupération des Pokémon.";
      } finally {
        this.isLoading = false;
      }
      this.stopTimer;
        this.last_id = this.pokemons[this.pokemons.length - 1].id;
        this.first_id = this.pokemons[0].id;
          console.log('-------------')
          console.log('min id: ' + this.first_id)
          console.log('max id: '+ this.last_id)

          console.log('last offset : ' + this.lastOffset)
          console.log('nb de test: ' + this.Nbtest)

          console.log('-------------')

      this.Nbtest = 0;
    },
    toggleShiny() {
      this.isShiny = !this.isShiny;
    },
    resetFilters() {
      this.selectedType1 = "";
      this.selectedType2 = "";
      this.priceOrder = "";
      this.currentPage = 0;
      this.Offset = 0;
      this.lastOffset = 0;
      console.clear();
      this.fetchPokemon();
    },
    fetchPreviousPage() {
      if (this.currentPage > 0) {
        this.currentPage--;
        if (this.selectedType1 != "" | this.selectedType2 != "") {
            this.Offset = this.lastOffset
        }else{
        this.Offset = this.currentPage * this.perPage;
        } 
        this.fetchPokemon();
      }
    },
    fetchNextPage() {
      if (this.currentPage < 43 && this.pokemons.length === this.perPage) {
        this.currentPage++;
        if (this.selectedType1 != "" | this.selectedType2 != "") {
              this.Offset = this.last_id;
        }else{
          this.Offset = this.currentPage * this.perPage;
        }
        this.fetchPokemon();
      }
    },
    async fetchTypes() {
      try {
        const types = [];
        for (let i = 1; i <= 18; i++) {
          const response = await fetchType(i);
          types.push(response.name);
        }
        this.types = types;
      } catch (error) {
        console.error("Erreur lors de la récupération des types :", error);
        this.error = "Une erreur est survenue lors de la récupération des types.";
      }
    },
    buy(id, shiny) {
      console.log(`Achat du Pokémon ${id} ${shiny}`);
    },
  },
  mounted() {
    this.fetchPokemon();
    this.fetchTypes();
  },
};
</script>

<style scoped>
.loading-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  position: relative;
}

.spinner {
  width: 100px;
  height: 100px;
  border: 8px solid rgba(0, 255, 255, 0.1);
  border-top: 8px solid blue;
  border-bottom: 8px solid blue;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.timer {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.2rem;
  font-weight: bold;
  color: #007bff;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
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
transition: transform 0.3s ease, box-shadow 0.3s ease;
width: 250px;
text-align: center;
padding: 15px;
}

.pokemon-card:hover {
  transform: translateY(-50px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.error {
  color: red;
  text-align: center;
  margin-top: 1rem;
}
#next{
  border-radius: 5px 15px 15px 15px ;
}
#prev{
  border-radius: 15px 5px 15px 15px ;
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
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width:  100px;
}

.pagination button:hover {
  background-color: #2deef4;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination div {
  font-size: 1.2rem;
  color: #01579b;
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
#filter {
display: flex;
justify-content: space-around;
align-items: center;
gap: 15px;
padding: 10px 20px;
margin-bottom: 20px;
background-color: #f9f9f9;
border: 1px solid #ddd;
border-radius: 10px;
box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
width: 50%;
margin: 0 auto;
}

.type-select {
padding: 10px 15px;
border: 1px solid #ddd;
border-radius: 8px;
background-color: #ffffff;
font-size: 1rem;
color: #555;
transition: all 0.3s ease;
cursor: pointer;
}

.type-select:focus {
border-color: #0288d1;
box-shadow: 0 0 5px rgba(2, 136, 209, 0.5);
outline: none;
}

.type-select:disabled {
background-color: #f0f0f0;
color: #999;
cursor: not-allowed;
}

button {
padding: 10px 20px;
border: none;
border-radius: 8px;
font-size: 1rem;
font-weight: bold;
cursor: pointer;
transition: background-color 0.3s ease, transform 0.2s ease;
}

#shiny {
background-color: #ffeb3b;
color: #333;
}

#shiny:hover {
background-color: #fdd835;
}

button:hover {
transform: scale(1.05);
}

button:disabled {
background-color: #ccc;
color: #666;
cursor: not-allowed;
}

button:hover:not(:disabled) {
background-color: #0288d1;
color: white;
}

button:active {
transform: scale(0.98);
}

button:last-of-type {
background-color: #f44336;
color: white;
}

button:last-of-type:hover {
background-color: #e53935;
}

</style>