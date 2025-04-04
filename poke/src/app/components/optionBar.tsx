'use client'

import React from 'react';

interface OptionBarProps {
    lang: boolean;
    setLang: (value: React.SetStateAction<boolean>) => void;
    handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
    gen: number | null;
    setGeneration: (value: number | null) => void;
    types: Map<number, { en: string; fr: string }>;
    type: number | null;
    setType: (value: number | null) => void;
    sortOption: string;
    handleSortChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

function OptionBar({
    lang,
    setLang,
    handleSearch,
    gen,
    setGeneration,
    types,
    type,
    setType,
    sortOption,
    handleSortChange
}: OptionBarProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mb-6">
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
    );
}

export default OptionBar;