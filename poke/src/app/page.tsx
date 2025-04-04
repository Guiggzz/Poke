'use client'

import { useEffect, useState } from "react";
import { fetchPoke } from "./fetchPoke";
import { fetchType } from "./fetchType";
import PokemonModal from "./components/PokemonModal";
import PokeCard from "./components/pokeCard";
import OptionBar from "./components/optionBar";
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

type SortOption =
  | "id_asc"
  | "id_desc"
  | "name_asc"
  | "name_desc"
  | "weight_asc"
  | "weight_desc"
  | "height_asc"
  | "height_desc";

export default function Home() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [types, setTypes] = useState<Map<number, { fr: string; en: string }>>(new Map());
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [lang, setLang] = useState(true);
  const [loading, setLoading] = useState(true);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gen, setGeneration] = useState<number | null>(1);
  const [type, setType] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>("id_asc");

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

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value as SortOption);
  };

  const sortedPokemons = [...pokemons].sort((a, b) => {
    switch (sortOption) {
      case "id_asc":
        return a.id - b.id;
      case "id_desc":
        return b.id - a.id;
      case "name_asc":
        return lang ?
          a.name.fr.localeCompare(b.name.fr) :
          a.name.en.localeCompare(b.name.en);
      case "name_desc":
        return lang ?
          b.name.fr.localeCompare(a.name.fr) :
          b.name.en.localeCompare(a.name.en);
      case "weight_asc":
        return a.weight - b.weight;
      case "weight_desc":
        return b.weight - a.weight;
      case "height_asc":
        return a.height - b.height;
      case "height_desc":
        return b.height - a.height;
      default:
        return a.id - b.id;
    }
  });

  const filteredPokemons = sortedPokemons.filter(poke =>
    (gen === null || poke.generation === gen) &&
    (type === null || poke.types.includes(type)) && (
      search === "" ||
      poke.name.fr.toLowerCase().includes(search.toLowerCase()) ||
      poke.name.en.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="bg-gradient-to-b from-blue-600 to-blue-800 min-h-screen p-4 sm:p-6 font-sans text-white">
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg p-6 rounded-xl flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 mb-8">
        <div className="flex items-center">
          <img
            src="/blue_pokeball_by_jormxdos_dfgb833-pre.png"
            alt="Pokeball icon"
            className="w-10 h-10 mr-3"
          />
          <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-500">Poke</h1>
        </div>

        {!loading && !error && (
          <OptionBar
            lang={lang}
            setLang={setLang}
            handleSearch={handleSearch}
            gen={gen}
            setGeneration={setGeneration}
            types={types}
            type={type}
            setType={setType}
            sortOption={sortOption}
            handleSortChange={handleSortChange}
          />
        )}
      </header>

      <div className="mt-6">
        {error ? (
          <div className="bg-red-500/80 p-6 rounded-xl shadow-lg max-w-2xl mx-auto">
            <p className="text-white text-center text-xl font-bold">Error: {error}</p>
          </div>
        ) : loading ? (
          <section className="flex flex-col items-center justify-center py-16">
            <div className="wrap">
              <div className="ball animate-bounce">
                <div className="balltop"></div>
                <div className="ballbutton"></div>
                <div className="ball__bottom"></div>
              </div>
              <div className="ballShadow animate-pulse"></div>
              <p className="text-center mt-8 text-2xl font-bold text-yellow-300 animate-pulse">
                {lang ? "Chargement des pokes..." : "Loading Pokes..."}
              </p>
            </div>
          </section>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {filteredPokemons.map((pokemon) => (
              <PokeCard
                key={pokemon.id}
                pokemon={pokemon}
                types={types}
                lang={lang}
                openPokemonModal={() => openPokemonModal(pokemon)}
              />
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