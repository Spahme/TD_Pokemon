import { defineStore } from "pinia";

export const usePokemonStore = defineStore('pokemon', {
    state: () => ({
        pokemons: [],
        selectedPokemon: null,
        loading: false,
        error: null,
        shinyPokemons: {}, // Stocke l'état shiny des Pokémon
    }),

    actions: {
        RemovePokemon(pokemonId) {
            this.pokemons = this.pokemons.filter(p => p.id !== pokemonId);
            delete this.shinyPokemons[pokemonId]; // Nettoie l'état shiny
        },

        Payer() {
            console.log('Payer');
            this.pokemons.forEach(pokemon => console.log(pokemon.id));
            console.log('Total : ' + this.totalPrice + ' $');
            console.log('Paiement effectué');
            console.log('---- Fin de transaction ----');
            this.pokemons = []; // Vide le panier après paiement
            this.shinyPokemons = {}; // Réinitialise les shiny
        },

        AddPokemon(pokemon) {
            this.pokemons.push(pokemon);
        },

        ToggleShiny(pokemonId) {
            this.shinyPokemons[pokemonId] = !this.shinyPokemons[pokemonId];
        }
    },

    getters: {
        totalPrice: (state) => {
            return state.pokemons.reduce((acc, p) => {
                const isShiny = state.shinyPokemons[p.id] || false;
                const price = isShiny ? p.price.shiny : p.price.default;
                return acc + (price || 0);
            }, 0);
        }
    }
});