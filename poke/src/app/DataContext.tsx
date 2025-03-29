'use client'
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { fetchPoke } from './fetchPoke';

interface Pokemon {
    id: number;
    name: { fr: string; en: string };
    image: string;
    image_shiny?: string;
    stats: {
        hp?: number;
        def: number;
        atk: number,
        vit: number,
        spe_atk: number,
        spe_def: number
    };
    height: number;
    weight: number;
    generation: number;
    types: number[];
    evolvedFrom: Record<number, string> | null;
    evolvesTo: Record<number, string> | null;
}

interface EvolutionNode {
    pokemon: Pokemon;
    children: EvolutionNode[];
}

interface DataContextType {
    pokemons: Pokemon[];
    findPokemon: (id: number) => Pokemon | undefined;
    buildEvolutionChain: (pokemon: Pokemon) => EvolutionNode | null;
    getPokemonImageById: (id: number) => string | undefined; // Nouvelle méthode
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
    const [pokemons, setPokemons] = useState<Pokemon[]>([]);

    useEffect(() => {
        async function loadPokemons() {
            try {
                const data = await fetchPoke();
                setPokemons(data);
            } catch (error) {
                console.error("Failed to load Pokemon data", error);
            }
        }
        loadPokemons();
    }, []);

    const findPokemon = (id: number): Pokemon | undefined => {
        return Array.isArray(pokemons)
            ? pokemons.find((pokemon: Pokemon) => pokemon.id === id)
            : undefined;
    };

    // Nouvelle méthode pour récupérer l'image d'un Pokémon par son ID
    const getPokemonImageById = (id: number): string | undefined => {
        const pokemon = findPokemon(id);
        return pokemon ? pokemon.image : undefined;
    };

    const buildEvolutionChain = (pokemon: Pokemon): EvolutionNode | null => {
        if (!pokemon) return null;

        const rootNode: EvolutionNode = {
            pokemon,
            children: []
        };

        if (pokemon.evolvesTo) {
            Object.keys(pokemon.evolvesTo).forEach(id => {
                const evolutionId = parseInt(id);
                const evolutionPokemon = findPokemon(evolutionId);
                if (evolutionPokemon) {
                    const childNode: EvolutionNode = {
                        pokemon: evolutionPokemon,
                        children: []
                    };
                    rootNode.children.push(childNode);
                }
            });
        }

        return rootNode;
    };

    const value = {
        pokemons,
        findPokemon,
        buildEvolutionChain,
        getPokemonImageById // Ajout de la nouvelle méthode
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
}