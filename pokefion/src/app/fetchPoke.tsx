async function fetchPoke() {
    const response = await fetch("https://pokedex-api.3rgo.tech/api/pokemon");
    if (!response.ok) {
        throw new Error("Erreur lors du chargement des données");
    }
    return response.json();
}

export { fetchPoke };
