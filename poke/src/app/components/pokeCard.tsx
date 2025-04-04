

interface Pokemon {
    id: number;
    name: {
        fr: string;
        en: string;
    };
    image: string;
    generation: number;
    types: number[];
}

export default function PokeCard({ pokemon, types, lang, openPokemonModal }: {
    pokemon: Pokemon;
    types: Map<number, { fr: string; en: string }>;
    lang: boolean;
    openPokemonModal: (pokemon: Pokemon) => void;
}) {
    return (


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
    );
}