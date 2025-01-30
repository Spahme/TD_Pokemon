<template>
  <div class="Pokemon_Panier_template">
    <h2>Mon Panier</h2>
    <div v-if="panier.pokemons.length">
      <div class="pokemon-card" v-for="pokemon in panier.pokemons" :key="pokemon.id">
        <h2 class="pokemon-name">{{ pokemon.name }}</h2>
        <p class="pokemon-id">ID: {{ pokemon.id }}</p>
        <img :src="isShiny[pokemon.id] ? pokemon.sprites.shiny : pokemon.sprites.front_default" 
             class="pokemon-image" 
             alt="Pokémon image" />
        <ul class="pokemon-types">
          <li>{{ pokemon.type1 }}</li>
          <li v-if="pokemon.type2">{{ pokemon.type2 }}</li>
        </ul>
        <p class="pokemon-price">Prix: {{ isShiny[pokemon.id] ? pokemon.price.shiny : pokemon.price.default }} $</p>
        <div id="more">      
          <button id="shiny" @click="toggleShiny(pokemon.id)">Shiny: {{ isShiny[pokemon.id] ? 'On' : 'Off' }}</button>
          <div id="stats">
            <span v-if="pokemon.stats" class="tooltip">
              <img src="../assets/tooltips.svg" alt="info" width="20px" height="20px" />
              <ul class="tooltiptext">
                <li><strong>Base Stats:</strong></li>
                <li v-for="stat in pokemon.stats" :key="stat.name">
                  {{ stat.name }}: {{ stat.base_stat }}
                </li>
              </ul>
            </span>
          </div>
        </div>
        <div class="remove-button" @click="remove(pokemon.id)">Retirer</div>
      </div>
      <p>Total : {{ panier.totalPrice }} $</p>
      <button @click="payer">Payer</button>
    </div>
    <p v-else>Votre panier est vide.</p>
  </div>
</template>

<script>
import { usePokemonStore } from '@/stores.js';
import { PokemonSearch } from '@/services/httpClient.js';

export default {
  name: 'Panier',
  data() {
    return {
      isShiny: {},
    };
  },
  computed: {
    panier() {
      return usePokemonStore();
    }
  },
  methods: {
    payer() {
      this.panier.Payer();
    },
    remove(id) {
      this.panier.RemovePokemon(id);
    },
    toggleShiny(id) {
      this.isShiny[id] = !this.isShiny[id];
    },
    fetchPokemon() {
      this.panier.pokemons.forEach(async (pokemon) => {
        const { data } = await PokemonSearch(pokemon.id);
        this.$set(pokemon, 'stats', data.stats);
      });
    }
  },
  mounted() {
    this.fetchPokemon();
    console.log(this.panier);
  }
};
</script>

<style scoped>
.Pokemon_Panier_template {
  max-width: 800px;
  margin: auto;
  text-align: center;
}

.pokemon-card {
  width: 250px;
  padding: 15px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  margin: 10px auto;
}

.pokemon-image {
  width: 100px;
  height: 100px;
}

.remove-button {
  margin-top: 10px;
  padding: 5px 10px;
  background-color: #e63946;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}
</style>
