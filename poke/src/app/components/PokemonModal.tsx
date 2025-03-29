'use client'

import { useState } from "react";
import { useData } from "../DataContext";

interface Pokemon {
    id: number;
    name: { fr: string; en: string };
    image: string;
    image_shiny?: string;
    stats: { hp?: number; def: number; atk: number, vit: number, spe_atk: number, spe_def: number };
    height: number;
    weight: number;
    generation: number;
    types: number[];
    evolvedFrom: Record<number, string> | null;
    evolvesTo: Record<number, string> | null;
}

interface ModalProps {
    pokemon: Pokemon;
    types: Map<number, { fr: string; en: string }>;
    lang: boolean;
    isOpen: boolean;
    onClose: () => void;
}

export default function PokemonModal({ pokemon, types, lang, isOpen, onClose }: ModalProps) {
    const { findPokemon } = useData();
    const [shinyMode, setShinyMode] = useState(false);

    if (!isOpen) return null;

    const getPokemonTypes = () =>
        pokemon.types.map(id => types.get(id) ? (lang ? types.get(id)!.fr : types.get(id)!.en) : "Inconnu").join(", ");

    const renderStatBar = (value: number, maxValue: number = 255) => {
        const percentage = Math.min((value / maxValue) * 100, 100);

        let barColor = "bg-green-500";
        if (value < 50) barColor = "bg-red-500";
        else if (value < 80) barColor = "bg-orange-500";
        else if (value < 120) barColor = "bg-yellow-500";

        return (
            <div className="w-full bg-blue-900/30 rounded-full h-3 overflow-hidden">
                <div
                    className={`${barColor} h-3 rounded-full transition-all duration-300 ease-in-out`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        );
    };

    return (
        <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start justify-center z-50 p-4 pt-10 overflow-y-auto"
            onClick={onClose}
        >
            <div
                className="bg-gradient-to-b from-indigo-600 to-indigo-800 rounded-2xl shadow-2xl max-w-full sm:max-w-3xl w-[95%] mx-auto relative transform transition-all duration-300 border border-indigo-400/50 my-6"
                onClick={e => e.stopPropagation()}
            >
                <div className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white p-5 sm:p-7 rounded-t-2xl flex justify-between items-center border-b border-indigo-400/30">
                    <div>
                        <div className="flex items-center">
                            <span className="bg-yellow-500 text-blue-900 px-2 py-1 rounded-lg mr-3 font-bold">#{pokemon.id}</span>
                            <h2 className="text-2xl sm:text-3xl font-bold text-yellow-300">
                                {lang ? pokemon.name.fr : pokemon.name.en}
                            </h2>
                        </div>
                        <div className="flex flex-wrap mt-2 gap-2">
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
                    <button
                        onClick={onClose}
                        className="bg-blue-900/50 hover:bg-blue-900 text-white rounded-full h-9 w-9 sm:h-11 sm:w-11 flex items-center justify-center text-2xl font-bold transition-all shadow-md"
                    >
                        &times;
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 sm:p-7 text-white">
                    <div className="flex flex-col items-center">
                        <div className="relative">
                            <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 rounded-xl p-6 flex justify-center items-center">
                                <img
                                    src={shinyMode && pokemon.image_shiny ? pokemon.image_shiny : pokemon.image}
                                    alt={pokemon.name.fr}
                                    className="w-52 sm:w-64 h-52 sm:h-64 object-contain transition-transform hover:scale-110 duration-300"
                                />
                            </div>
                            {pokemon.image_shiny && (
                                <button
                                    onClick={() => setShinyMode(!shinyMode)}
                                    className="absolute bottom-4 right-4 bg-yellow-500 text-blue-900 px-3 py-1 rounded-lg text-sm font-bold hover:bg-yellow-400 transition-all shadow-md"
                                >
                                    {shinyMode ? (lang ? 'Normal' : 'Normal') : (lang ? 'Chromatique' : 'Shiny')}
                                </button>
                            )}
                        </div>
                    </div>

                    <div>
                        <div className="space-y-4 text-sm sm:text-base">
                            <h3 className="text-lg font-bold text-yellow-300 mb-2">{lang ? "Statistiques" : "Stats"}</h3>
                            {[
                                { label: lang ? "Attaque" : "Attack", value: pokemon.stats.atk },
                                { label: lang ? "Défense" : "Defense", value: pokemon.stats.def },
                                { label: lang ? "Vitesse" : "Speed", value: pokemon.stats.vit },
                                { label: lang ? "Attaque Spéciale" : "Special Attack", value: pokemon.stats.spe_atk },
                                { label: lang ? "Défense Spéciale" : "Special Defense", value: pokemon.stats.spe_def }
                            ].map((stat, index) => (
                                <div key={index}>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm sm:text-base font-medium">{stat.label}</span>
                                        <span className="text-sm sm:text-base font-bold text-yellow-300">{stat.value}</span>
                                    </div>
                                    {renderStatBar(stat.value)}
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-4 text-sm sm:text-base bg-blue-900/30 p-4 rounded-xl">
                            <p><span className="font-bold text-yellow-300">{lang ? "Génération" : "Generation"}:</span> {pokemon.generation}</p>
                            <p><span className="font-bold text-yellow-300">{lang ? "Taille" : "Height"}:</span> {pokemon.height} m</p>
                            <p><span className="font-bold text-yellow-300">{lang ? "Poids" : "Weight"}:</span> {pokemon.weight} kg</p>
                        </div>

                        {(pokemon.evolvedFrom && Object.keys(pokemon.evolvedFrom).length > 0) ||
                            (pokemon.evolvesTo && Object.keys(pokemon.evolvesTo).length > 0) ? (
                            <div className="mt-6">
                                <h3 className="text-xl font-bold text-yellow-300 mb-3">{lang ? "Évolutions" : "Evolutions"}</h3>

                                {pokemon.evolvedFrom && Object.keys(pokemon.evolvedFrom).length > 0 && (
                                    <div className="mb-4">
                                        <h4 className="text-sm font-medium mb-2 opacity-80">{lang ? "Évolue de" : "Evolves from"}</h4>
                                        <div className="space-y-2">
                                            {Object.entries(pokemon.evolvedFrom).map(([id, evolutionMethod]) => {
                                                const evolutionPokemon = findPokemon(parseInt(id));
                                                return (
                                                    <div key={id} className="bg-blue-900/50 p-3 rounded-lg shadow-md border border-indigo-400/30">
                                                        <p className="font-bold text-yellow-300">
                                                            {evolutionPokemon
                                                                ? (lang ? evolutionPokemon.name.fr : evolutionPokemon.name.en)
                                                                : `#${id}`}
                                                        </p>
                                                        <p className="text-sm opacity-90">{evolutionMethod}</p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {pokemon.evolvesTo && Object.keys(pokemon.evolvesTo).length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-medium mb-2 opacity-80">{lang ? "Évolue en" : "Evolves to"}</h4>
                                        <div className="space-y-2">
                                            {Object.entries(pokemon.evolvesTo).map(([id, evolutionMethod]) => {
                                                const evolutionPokemon = findPokemon(parseInt(id));
                                                return (
                                                    <div key={id} className="bg-blue-900/50 p-3 rounded-lg shadow-md border border-indigo-400/30">
                                                        <p className="font-bold text-yellow-300">
                                                            {evolutionPokemon
                                                                ? (lang ? evolutionPokemon.name.fr : evolutionPokemon.name.en)
                                                                : `#${id}`}
                                                        </p>
                                                        <p className="text-sm opacity-90">{evolutionMethod}</p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
}