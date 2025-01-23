import { createRouter, createWebHistory } from 'vue-router'
import App from '@/App.vue'
import Pokemon_list_template from './components/Poke_list.vue'
import Poke_Search_Templates from './components/Poke_search.vue'
import Pokedex from './components/Pokedex.vue'
import Panier from './components/Panier.vue'

const routes = [{
        path: '/list/pokemons',
        name: 'listPokemons',
        component: Pokemon_list_template,
    },
    {
        path: '/search/pokemon',
        name: 'searchPokemon',
        component: Poke_Search_Templates,
    },
    {
        path: '/pokedex/all',
        name: 'pokedexAll',
        component: Pokedex,
    },
    {
        path: '/home',
        name: 'home',
        component: App,
    },
    {
        path: '/panier',
        name: 'panier',
        component: Panier,
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})




export { router }