'use client'

import { useEffect, useState } from "react";
import { fetchPoke } from "./fetchPoke";
import { fetchType } from "./fetchType";

interface Pokemon {
  id: number;
  name: { fr: string; en: string };
  image: string;
  stats: { def: number; atk: number };
  height: number;
  weight: number;
  generation: number;
  types: number[];
}

interface Type {
  id: number;
  name: { fr: string; en: string };
  image: string;
}

export default function Home() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [types, setTypes] = useState<Map<number, string>>(new Map());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPoke()
      .then((res) => setPokemons(res.data))
      .catch((err) => setError(err.message));

    fetchType()
      .then((res) => {
        const typeMap = new Map<number, string>();
        res.data.forEach((type: Type) => {
          typeMap.set(type.id, type.name.fr);
        });
        setTypes(typeMap);
      })
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div>
      <h1>Pokédex</h1>
      {error ? (
        <p style={{ color: "red" }}>Erreur : {error}</p>
      ) : pokemons.length === 0 ? (
        <p>Chargement...</p>
      ) : (
        <div className="grid grid-cols-6 gap-4">
          {pokemons.map((pokemon) => (
            <div key={pokemon.id} className="border p-4">
              <h2>#{pokemon.id}</h2>
              <h2>{pokemon.generation}</h2>
              <h2>{pokemon.name.fr} ({pokemon.name.en})</h2>
              <img src={pokemon.image} alt={pokemon.name.fr} width={100} />
              <p>Type: {pokemon.types.map(id => types.get(id) || "Inconnu").join(", ")}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
