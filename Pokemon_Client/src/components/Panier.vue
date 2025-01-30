<template>
  <div class="panier">
    
  </div>
</template>

<script>
import { fetchPokemon } from '@/services/httpClient';
import { defineStore } from 'pinia';

export const Panier = defineStore ('achat', {
  state: ()=>({
    pokemons: [],
    types: [],
    currentPage: 0,
    error: null,
    perPage: 30,
    PokemonDetail: null,
    showDetail: false,
    filter: 'null',
    isShiny: false,
    allPrice: 0,
  }),
action:{
 payer (){
   this.pokemons = []
 },
  RemovePokemon (pokemon){
    this.pokemons = this.pokemons.filter(p => p !== pokemon)
  },
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
      }
    }
  }
  },
  getter:{
    totalPrice(){
      return this.pokemons.reduce((acc, p) => acc + p.price, 0)
    },
  }
}
})
</script>