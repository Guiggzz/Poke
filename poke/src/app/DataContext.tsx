'use client'

import { createContext, useContext, ReactNode, useState } from 'react';

interface Pokemon {
    id: number;
    name: { fr: string; en: string };
    image: string;
    stats: { def: number; atk: number, vit: number, spe_atk: number, spe_def: number };
    height: number;
    weight: number;
    generation: number;
    types: number[];
    evolvedFrom: Record<number, string> | null;
    evolvesTo: Record<number, string> | null;

}

interface DataContextType {
    pokemons: Pokemon[];
    findPokemon: (id: number) => Pokemon | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
    const [pokemons, setPokemons] = useState([]);

    const findPokemon = (id: number) => pokemons.find((pokemon: { id: number; }) => pokemon.id === id);
    const value = {
        pokemons,
        findPokemon,
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