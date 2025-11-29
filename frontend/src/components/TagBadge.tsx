interface TagBadgeProps {
    name: string;
}

export default function TagBadge({ name }: TagBadgeProps) {
    return (
        <span style={{
            backgroundColor: '#f1f8e9',
            color: '#558b2f',
            padding: '4px 10px',
            borderRadius: '15px',
            fontSize: '12px',
            fontWeight: '500',
            border: '1px solid #c5e1a5'
        }}>
            #{name}
        </span>
    );
}