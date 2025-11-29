import { useEffect, useState } from 'react';
import type { Tag } from '../types';

interface FilterBarProps {
    selectedTag: string | null;
    onSelectTag: (tagName: string | null) => void;
}

export default function FilterBar({ selectedTag, onSelectTag }: FilterBarProps) {
    const [tags, setTags] = useState<Tag[]>([]);

    useEffect(() => {
        // Qui dovresti chiamare api.getTags().
        // Per ora metto dei dati statici per farti vedere che funziona subito
        // Sostituisci con la fetch reale appena puoi.
        setTags([
            { id: 1, name: 'Ecologia' },
            { id: 2, name: 'Riciclo' },
            { id: 3, name: 'Eventi' },
            { id: 4, name: 'ZeroWaste' }
        ]);
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
                    fontWeight: 'bold'
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
                        cursor: 'pointer'
                    }}
                >
                    #{tag.name}
                </button>
            ))}
        </div>
    );
}