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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-red-700 border-4 border-black p-6 rounded-lg shadow-lg max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold">{lang ? pokemon.name.fr : pokemon.name.en} #{pokemon.id}</h2>
                    <button
                        onClick={onClose}
                        className="bg-red-900 hover:bg-red-800 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold"
                    >
                        &times;
                    </button>
                </div>

                <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/2 flex items-center justify-center mb-4 md:mb-0">
                        <img
                            src={pokemon.image}
                            alt={pokemon.name.fr}
                            className="border-2 border-black rounded-md bg-red-600 p-2 max-w-full h-auto"
                        />
                    </div>
                    <div className="md:w-1/2 md:pl-4">
                        <p className="mb-2"><span className="font-bold">{lang ? "Génération" : "Generation"}:</span> {pokemon.generation}</p>
                        <p className="mb-2">
                            <span className="font-bold">{lang ? "Type" : "Type"}:</span>{" "}
                            {pokemon.types.map(id => types.get(id) ? (lang ? types.get(id)!.fr : types.get(id)!.en) : "Inconnu").join(", ")}
                        </p>
                        <p className="mb-2"><span className="font-bold">{lang ? "Attaque" : "Attack"}:</span> {pokemon.stats.atk}</p>
                        <p className="mb-2"><span className="font-bold">{lang ? "Défense" : "Defense"}:</span> {pokemon.stats.def}</p>
                        <p className="mb-2"><span className="font-bold">{lang ? "Taille" : "Height"}:</span> {pokemon.height} m</p>
                        <p className="mb-2"><span className="font-bold">{lang ? "Poids" : "Weight"}:</span> {pokemon.weight} kg</p>
                        <p className="mb-2"><span className="font-bold">{lang ? "Vitesse" : "Speed"}:</span> {pokemon.stats.vit}</p>
                        <p className="mb-2"><span className="font-bold">{lang ? "Attaque Spéciale" : "Special Attack"}:</span> {pokemon.stats.spe_atk}</p>
                        <p className="mb-2"><span className="font-bold">{lang ? "Défense Spéciale" : "Special Defense"}:</span> {pokemon.stats.spe_def}</p>
                        <p className="mb-2"><span className="font-bold">{lang ? "Évolution" : "Evolution"}:</span> {pokemon.evolvedFrom ? Object.values(pokemon.evolvedFrom).join(', ') : '-'}</p>

                        {pokemon.evolvesTo && Object.keys(pokemon.evolvesTo).length > 0 && (
                            <>
                                <p className="mb-2"><span className="font-bold">{lang ? "Évolutions" : "Evolutions"}:</span></p>
                                <div className="flex flex-wrap gap-2">
                                    {Object.keys(pokemon.evolvesTo).map(id => {
                                        const evolutionId = parseInt(id);
                                        const evolutionPokemon = findPokemon(evolutionId);
                                        return (
                                            <div key={evolutionId} className="text-center">
                                                <img
                                                    src={evolutionPokemon?.image}
                                                    alt={evolutionPokemon ? (lang ? evolutionPokemon.name.fr : evolutionPokemon.name.en) : `Pokemon #${evolutionId}`}
                                                    className="w-16 h-16 border-2 border-black rounded-md bg-red-600 p-1"
                                                />
                                                <p className="text-xs font-bold">
                                                    {evolutionPokemon
                                                        ? (lang ? evolutionPokemon.name.fr : evolutionPokemon.name.en)
                                                        : `#${evolutionId}`}
                                                </p>
                                                <p className="text-xs">{pokemon.evolvesTo[evolutionId]}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}