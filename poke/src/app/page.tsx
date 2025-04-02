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

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            className="p-2 bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold rounded-lg transition-all duration-300 w-full sm:w-auto shadow-md"
            onClick={() => setLang(prevLang => !prevLang)}
          >
            {lang ? "Français" : "English"}
          </button>
          <input
            type="text"
            placeholder={lang ? "Rechercher un poke" : "Search a Poke"}
            className="p-2 text-gray-800 bg-white/90 rounded-lg border-2 border-indigo-300 focus:border-yellow-400 focus:outline-none w-full sm:w-auto shadow-md"
            onChange={handleSearch}
          />
          <select
            className="p-2 text-gray-800 bg-white/90 rounded-lg border-2 border-indigo-300 focus:border-yellow-400 focus:outline-none w-full sm:w-auto shadow-md"
            value={gen === null ? 'all' : gen}
            onChange={(e) => setGeneration(e.target.value === 'all' ? null : Number(e.target.value))}
          >
            <option value="all">{lang ? "Toutes Générations" : "All Generations"}</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((generation) => (
              <option key={generation} value={generation}>
                Gen {generation}
              </option>
            ))}
          </select>
          <select
            className="p-2 text-gray-800 bg-white/90 rounded-lg border-2 border-indigo-300 focus:border-yellow-400 focus:outline-none w-full sm:w-auto shadow-md"
            value={type === null ? 'all' : type}
            onChange={(e) => setType(e.target.value === 'all' ? null : Number(e.target.value))}
          >
            <option value="all">{lang ? "Tous les types" : "All Types"}</option>
            {Array.from(types.entries()).map(([typeId, typeName]) => (
              <option key={typeId} value={typeId}>
                {lang ? typeName.fr : typeName.en}
              </option>
            ))}
          </select>
          <select
            className="p-2 text-gray-800 bg-white/90 rounded-lg border-2 border-indigo-300 focus:border-yellow-400 focus:outline-none w-full sm:w-auto shadow-md"
            value={sortOption}
            onChange={handleSortChange}
          >
            <option value="id_asc">{lang ? "# croissant" : "# ascending"}</option>
            <option value="id_desc">{lang ? "# décroissant" : "# descending"}</option>
            <option value="name_asc">{lang ? "Nom croissant" : "Name ascending"}</option>
            <option value="name_desc">{lang ? "Nom décroissant" : "Name descending"}</option>
            <option value="weight_asc">{lang ? "Poids croissant" : "Weight ascending"}</option>
            <option value="weight_desc">{lang ? "Poids décroissant" : "Weight descending"}</option>
            <option value="height_asc">{lang ? "Taille croissant" : "Height ascending"}</option>
            <option value="height_desc">{lang ? "Taille décroissant" : "Height descending"}</option>
          </select>
        </div>
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
              <div
                key={pokemon.id}
                className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-4 rounded-2xl shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer transform hover:-rotate-1 border border-indigo-400/50"
                onClick={() => openPokemonModal(pokemon)}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xl font-bold bg-yellow-500 text-blue-900 px-2 py-1 rounded-lg">#{pokemon.id}</span>
                  <span className="text-sm bg-blue-900/50 px-2 py-1 rounded-lg">Gen {pokemon.generation}</span>
                </div>

                <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 rounded-xl mb-3 p-3 flex justify-center items-center">
                  <img
                    src={pokemon.image}
                    alt={pokemon.name.fr}
                    className="w-32 h-32 sm:w-40 sm:h-40 object-contain transform hover:scale-110 transition-transform duration-300"
                  />
                </div>

                <h2 className="text-lg sm:text-xl font-bold mb-2 text-center text-yellow-300 truncate">
                  {lang ? pokemon.name.fr : pokemon.name.en}
                </h2>

                <div className="flex flex-wrap justify-center gap-2">
                  {pokemon.types.map(id => (
                    <span
                      key={id}
                      className="text-xs px-2 py-1 bg-blue-900/70 rounded-full"
                    >
                      {types.get(id) ? (lang ? types.get(id)!.fr : types.get(id)!.en) : "?"}
                    </span>
                  ))}
                </div>
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