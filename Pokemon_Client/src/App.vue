<script setup>
import { RouterLink, RouterView } from 'vue-router' 
</script>

<template>
  <header>
      <h1>Pokemon App</h1>

      <nav>
        <RouterLink :to="{name:'home'}">Home</RouterLink>
        <RouterLink :to="{name:'listPokemons'}">List de pokemon</RouterLink>
        <RouterLink :to="{name:'searchPokemon'}">Recherche de pokemon</RouterLink>
        <RouterLink :to="{name:'pokedexAll'}">Pokedex</RouterLink>
        <RouterLink :to="{name:'panier'}">Panier</RouterLink>

      </nav>
  </header>
  <main> 
    <RouterView />
  </main>
</template>


<style scoped>
header {
  background-color: #b3e5fc;
  color: #333;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

header h1 {
  margin: 0;
  font-size: 2rem;
  color: #01579b;
}

nav {
  margin-top: 1rem;
}

nav a {
  text-decoration: none;
  color: #0277bd;
  font-weight: bold;
  margin: 0 1rem;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

nav a:hover {
  background-color: #e1f5fe;
}

main {
  padding: 2rem;
}

</style>
