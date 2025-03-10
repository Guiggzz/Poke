async function fetchType() {
    const response = await fetch("https://pokedex-api.3rgo.tech/api/types");
    if (!response.ok) {
        throw new Error("Erreur lors du chargement des données");
    }
    return response.json();
}

export { fetchType };
