const BASE_URL = 'https://pokeapi.co/api/v2';

const request = async(endpoint, options = {}) => {
    const url = `${BASE_URL}${endpoint}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
};

const PokemonDetail = async(endpoint, options = {}) => {
    const url = `${endpoint}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
};

const PokemonSearch = (input) => {
    if (input) {
        return request(`/pokemon/${input}`);
    }
    throw new Error('ID or Name must be provided');
};

const fetchPokemon = (limit, offset) => {
    return request(`/pokemon?limit=${limit}&offset=${offset}`);
};
const fetchType = (id) => {
    return request(`/type/${id}`);
};

export { request, fetchPokemon, PokemonSearch, PokemonDetail, fetchType };