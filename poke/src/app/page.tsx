'use client'

import { useEffect, useState } from "react";
import { fetchPoke } from "./fetchPoke";
import { fetchType } from "./fetchType";
import PokemonModal from "./components/PokemonModal";
import "./globals.css"

interface Pokemon {
  id: number;
  name: { fr: string; en: string };
  image: string;
  stats: {
    def: number;
    atk: number;
    vit: number;
    spe_atk: number;
    spe_def: number;
  };
  height: number;
  weight: number;
  generation: number;
  types: number[];
  evolvedFrom: Record<number, string> | null;
  evolvesTo: Record<number, string> | null;
}

interface Type {
  id: number;
  name: { fr: string; en: string };
  image: string;
}

export default function Home() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [types, setTypes] = useState<Map<number, { fr: string; en: string }>>(new Map());
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [lang, setLang] = useState(true);
  const [loading, setLoading] = useState(true);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const pokeResponse = await fetchPoke();
        const typeResponse = await fetchType();
        const typeMap = new Map<number, { fr: string; en: string }>();
        typeResponse.data.forEach((type: Type) => {
          typeMap.set(type.id, type.name);
        });
        await new Promise(resolve => setTimeout(resolve, 1500));
        setPokemons(pokeResponse.data);
        setTypes(typeMap);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSearch = (e: { target: { value: any } }) => {
    setSearch(e.target.value);
  };

  const openPokemonModal = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-red-600 min-h-screen p-6 font-mono text-white">
      <header className="bg-red-900 border-4 border-black p-4 flex justify-between rounded-md">
        <h1 className="text-2xl font-bold">Pokéfion</h1>
        <button className="p-2 bg-red-800 rounded-md hover:bg-red-700 transition-colors" onClick={() => setLang(prevLang => !prevLang)}>{lang ? "Français" : "English"}</button>
        <input
          type="text"
          placeholder={lang ? "Rechercher un pokéfion" : "Search a pokefion"}
          className="p-2 text-black rounded-md border-2 border-black"
          onChange={handleSearch}
        />
      </header>
      <div className="mt-6">
        {error ? (
          <p className="text-yellow-300">Erreur : {error}</p>
        ) : loading ? (
          <section className="wrap">
            <div className="ball">
              <div className="balltop"></div>
              <div className="ballbutton"></div>
              <div className="ball__bottom"></div>
            </div>
            <div className="ballShadow"></div>
            <p className="text-center mt-4 text-xl animate-pulse">Chargement des Pokéfions...</p>
          </section>) : (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {pokemons
              .filter((poke) => search === "" || poke.name.fr.toLowerCase().includes(search.toLowerCase()) || poke.name.en.toLowerCase().includes(search.toLowerCase()))
              .map((pokemon) => (
                <div
                  key={pokemon.id}
                  className="bg-red-800 border-4 border-black p-4 rounded-md shadow-md hover:scale-105 transition-transform cursor-pointer"
                  onClick={() => openPokemonModal(pokemon)}
                >
                  <h2 className="text-xl font-bold">#{pokemon.id}</h2>
                  <h3 className="text-sm">Gen: {pokemon.generation}</h3>
                  <h2 className="text-lg">{lang ? pokemon.name.fr : pokemon.name.en}</h2>
                  <img src={pokemon.image} alt={pokemon.name.fr} className="mx-auto my-2 border-2 border-black rounded-md" />
                  <p className="text-sm">
                    Type:{" "}
                    {pokemon.types.map(id => types.get(id) ? (lang ? types.get(id)!.fr : types.get(id)!.en) : "Inconnu").join(", ")}
                  </p>
                </div>
              ))}
          </div>
        )}
      </div>

      {selectedPokemon && (
        <PokemonModal
          pokemon={selectedPokemon}
          types={types}
          lang={lang}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </div>
  );
}