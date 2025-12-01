import { useEffect, useState } from 'react';
import { api } from '../services/api'; // Assicurati che api.getTags sia implementato come visto prima
import type { Tag } from '../types';

interface FilterBarProps {
    selectedTag: string | null;
    onSelectTag: (tagName: string | null) => void;
}

export default function FilterBar({ selectedTag, onSelectTag }: FilterBarProps) {
    const [tags, setTags] = useState<Tag[]>([]);

    useEffect(() => {
        // Chiediamo al backend quali tag esistono nel database (quelli creati da DataInitializer)
        const fetchTags = async () => {
            try {
                const data = await api.getTags();
                setTags(data);
            } catch (error) {
                console.error("Errore caricamento tags:", error);
            }
        };

        fetchTags();
    }, []);

    return (
        <div style={{ padding: '15px 0', display: 'flex', gap: '10px', overflowX: 'auto' }}>
            <button
                onClick={() => onSelectTag(null)}
                style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: 'none',
                    backgroundColor: selectedTag === null ? '#2e7d32' : '#e0e0e0',
                    color: selectedTag === null ? 'white' : 'black',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap'
                }}
            >
                Tutti
            </button>
            {tags.map(tag => (
                <button
                    key={tag.id}
                    onClick={() => onSelectTag(tag.name)}
                    style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        border: 'none',
                        backgroundColor: selectedTag === tag.name ? '#2e7d32' : '#e0e0e0',
                        color: selectedTag === tag.name ? 'white' : 'black',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                    }}
                >
                    #{tag.name}
                </button>
            ))}
        </div>
    );
}