import { useNavigate } from 'react-router-dom';
import type { Post, User } from '../types';
import CommentSection from './CommentSection';
import TagBadge from './TagBadge';
import SupportButton from './SupportButton';

interface PostCardProps {
    post: Post;
    showActions?: boolean;
    onApprove?: (id: number) => void;
    onReject?: (id: number) => void;

    isOwnPost?: boolean;
    onDelete?: (id: number) => void;
    onEdit?: (post: Post) => void;
}

export default function PostCard({ post, showActions, onApprove, onReject, isOwnPost, onDelete, onEdit }: PostCardProps) {
    const navigate = useNavigate();
    const userString = localStorage.getItem('user');
    const currentUser: User | null = userString ? JSON.parse(userString) : null;

    const handleUserClick = () => {
        navigate(`/profile/${post.author.id}`);
    };

    return (
        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>

                <div
                    onClick={handleUserClick}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        cursor: 'pointer'
                    }}
                    title={`Vai al profilo di @${post.author.username}`}
                >
                    <div style={{
                        width: '40px', height: '40px', borderRadius: '50%',
                        backgroundColor: '#e0f2f1', color: '#00695c',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 'bold', overflow: 'hidden', border: '1px solid #eee'
                    }}>
                        {post.author.profilePicture ? (
                            <img
                                src={post.author.profilePicture}
                                alt={post.author.username}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            post.author.username.charAt(0).toUpperCase()
                        )}
                    </div>

                    <div>
                        <strong
                            style={{ display: 'block', color: '#333' }}
                            onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                            onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                        >
                            @{post.author.username}
                        </strong>
                        <span style={{ fontSize: '12px', color: '#888' }}>{new Date(post.creationDate).toLocaleDateString()}</span>
                    </div>
                </div>

                {post.status === 'PENDING' && <span style={{ backgroundColor: '#fff3e0', color: '#ef6c00', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', height: 'fit-content' }}>In Attesa</span>}
                {post.status === 'REQUIRES_CHANGES' && <span style={{ backgroundColor: '#fff3e0', color: '#c62828', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', height: 'fit-content' }}>Richiede Modifiche</span>}
            </div>

            <h3 style={{ margin: '10px 0', fontSize: '18px' }}>{post.title}</h3>
            <p style={{ lineHeight: '1.6', color: '#444' }}>{post.content}</p>

            {post.imageUrl && (
                <img src={post.imageUrl} alt="post" style={{width: '100%', borderRadius: '8px', marginTop: '10px', maxHeight: '300px', objectFit: 'cover'}} />
            )}

            <div style={{ display: 'flex', gap: '8px', marginTop: '15px', flexWrap: 'wrap' }}>
                {post.tags.map(tag => (
                    <TagBadge key={tag.id} name={tag.name} />
                ))}
            </div>

            {isOwnPost && (onEdit || onDelete) && (
                <div style={{ marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '10px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    {onEdit && post.status !== 'APPROVED' && (
                        <button
                            onClick={() => onEdit(post)}
                            style={{ padding: '6px 12px', backgroundColor: '#fff', border: '1px solid #ffa000', color: '#ffa000', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            ✏️ Modifica
                        </button>
                    )}

                    {onDelete && (
                        <button
                            onClick={() => onDelete(post.id)}
                            style={{ padding: '6px 12px', backgroundColor: '#fff', border: '1px solid #d32f2f', color: '#d32f2f', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            🗑️ Elimina
                        </button>
                    )}
                </div>
            )}

            {!showActions && (
                <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <SupportButton post={post} currentUser={currentUser} />
                </div>
            )}

            {showActions && onApprove && onReject && (
                <div style={{ borderTop: '1px solid #eee', marginTop: '15px', paddingTop: '15px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button onClick={() => onReject(post.id)} style={{ padding: '8px 15px', border: '1px solid #ef5350', color: '#ef5350', backgroundColor: 'white', borderRadius: '4px', cursor: 'pointer' }}>Rifiuta</button>
                    <button onClick={() => onApprove(post.id)} style={{ padding: '8px 15px', backgroundColor: '#66bb6a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Approva</button>
                </div>
            )}

            {!showActions && (
                <CommentSection post={post} currentUser={currentUser} />
            )}
        </div>
    );
}