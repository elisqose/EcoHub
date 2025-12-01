import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import UserList from '../components/UserList';
import EditPost from '../components/EditPost';
import { api } from '../services/api';
import type { User, Post } from '../types';

export default function UserProfilePage() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Stati Dati
    const [profileUser, setProfileUser] = useState<User | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    // Stati Modali
    const [modalType, setModalType] = useState<'NONE' | 'FOLLOWERS' | 'FOLLOWING'>('NONE');
    const [editingPost, setEditingPost] = useState<Post | null>(null);

    // Stati Edit Bio
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [tempBio, setTempBio] = useState('');

    // Stati Richiesta Moderatore
    const [isModRequestOpen, setIsModRequestOpen] = useState(false);
    const [modMotivation, setModMotivation] = useState('');

    // Ref per upload foto
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Utente Loggato
    const storedUser = localStorage.getItem('user');
    const currentUser: User | null = storedUser ? JSON.parse(storedUser) : null;

    // Logica ID Profilo
    const userIdToLoad = id ? parseInt(id) : currentUser?.id;
    const isOwnProfile = !id || (!!currentUser && parseInt(id!) === currentUser.id);

    // Check Follow
    const isFollowing = profileUser?.followers?.some(u => u.id === currentUser?.id);

    useEffect(() => {
        if (userIdToLoad) {
            loadProfileData();
        }
    }, [userIdToLoad]);

    const loadProfileData = async () => {
        if (!userIdToLoad) return;
        try {
            const userData = await api.getUserProfile(userIdToLoad);
            setProfileUser(userData);
            setTempBio(userData.bio || ''); // Pre-popola la bio per l'edit
            const userPosts = await api.getUserPosts(userIdToLoad);
            setPosts(userPosts);
        } catch (error) {
            console.error("Errore caricamento profilo:", error);
        } finally {
            setLoading(false);
        }
    };

    // --- AZIONE: CAMBIO FOTO ---
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !currentUser) return;

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result as string;
            try {
                await api.updateProfilePicture(currentUser.id, base64String);

                // Aggiorna stato locale
                if (profileUser) {
                    setProfileUser({ ...profileUser, profilePicture: base64String });
                }
                // Aggiorna localStorage
                const updatedCurrentUser = { ...currentUser, profilePicture: base64String };
                localStorage.setItem('user', JSON.stringify(updatedCurrentUser));

                alert("Foto profilo aggiornata! 📸");
            } catch (error) {
                console.error("Errore upload foto:", error);
                alert("Errore durante l'aggiornamento della foto.");
            }
        };
        reader.readAsDataURL(file);
    };

    // --- AZIONE: FOLLOW / UNFOLLOW ---
    const handleToggleFollow = async () => {
        if (!currentUser || !profileUser) return;
        try {
            if (isFollowing) {
                await api.unfollow(currentUser.id, profileUser.id);
                alert(`Non segui più @${profileUser.username}`);
            } else {
                await api.follow(currentUser.id, profileUser.id);
                alert(`Ora segui @${profileUser.username}!`);
            }
            loadProfileData();
        } catch (error) {
            alert("Errore operazione follow");
        }
    };

    // --- AZIONE: CONTATTA ---
    const handleContact = () => {
        if (!profileUser) return;
        navigate('/messages');
        alert(`Copia questo username per scrivergli: ${profileUser.username}`);
    };

    // --- AZIONE: SALVA BIO ---
    const handleSaveBio = async () => {
        if(!currentUser) return;
        try {
            await api.updateBio(currentUser.id, tempBio);
            if(profileUser) setProfileUser({...profileUser, bio: tempBio});

            const updatedLocal = {...currentUser, bio: tempBio};
            localStorage.setItem('user', JSON.stringify(updatedLocal));

            setIsEditingBio(false);
        } catch (error) {
            alert("Errore salvataggio bio");
        }
    };

    // --- AZIONE: POST ---
    const handleDeletePost = async (postId: number) => {
        if (!confirm("Sei sicuro di voler eliminare questo post?")) return;
        try {
            if (currentUser) {
                await api.deletePost(postId, currentUser.id);
                setPosts(posts.filter(p => p.id !== postId));
            }
        } catch (err) {
            console.error(err);
            alert("Errore durante l'eliminazione.");
        }
    };

    const handleEditPost = (post: Post) => {
        setEditingPost(post);
    };

    // --- AZIONE: DIVENTA MODERATORE ---
    const handleBecomeModerator = async () => {
        if (!modMotivation.trim()) return alert("Inserisci una motivazione!");
        if (!profileUser) return;

        try {
            await api.requestModeration(profileUser.username, modMotivation);
            alert("Richiesta inviata con successo all'amministratore!");
            setIsModRequestOpen(false);
            setModMotivation('');
        } catch (error) {
            console.error(error);
            alert("Errore nell'invio della richiesta.");
        }
    };

    // --- RENDER ---
    if (!currentUser) return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
            <h2 style={{ color: '#2e7d32' }}>EcoHub 🌱</h2>
            <p>Devi effettuare il login.</p>
            <a href="/login" style={{ color: '#2e7d32', fontWeight: 'bold' }}>Vai al login</a>
        </div>
    );

    if (loading) return <p style={{ textAlign: 'center', marginTop: '50px', color: '#666' }}>Caricamento profilo...</p>;

    const approvedPosts = posts.filter(p => p.status === 'APPROVED');
    const pendingPosts = isOwnProfile ? posts.filter(p => p.status === 'PENDING' || p.status === 'REQUIRES_CHANGES') : [];
    const rejectedPosts = isOwnProfile ? posts.filter(p => p.status === 'REJECTED') : [];

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5'}}>
            <Navbar user={currentUser} />

            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>

                {/* --- HEADER PROFILO --- */}
                <div style={{
                    backgroundColor: 'white',
                    padding: '30px',
                    marginBottom: '30px',
                    borderRadius: '8px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    textAlign: 'center'
                }}>
                    {/* AVATAR + EDIT */}
                    <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 15px auto' }}>
                        {profileUser?.profilePicture ? (
                            <img
                                src={profileUser.profilePicture}
                                alt="Profile"
                                style={{
                                    width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover',
                                    border: '4px solid #e8f5e9'
                                }}
                            />
                        ) : (
                            <div style={{
                                width: '100%', height: '100%', borderRadius: '50%',
                                backgroundColor: '#2e7d32', color: 'white', fontSize: '40px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 'bold', border: '4px solid #e8f5e9'
                            }}>
                                {profileUser?.username.charAt(0).toUpperCase()}
                            </div>
                        )}

                        {isOwnProfile && (
                            <>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    title="Cambia foto"
                                    style={{
                                        position: 'absolute', bottom: '0', right: '0',
                                        backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '50%',
                                        width: '32px', height: '32px', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                                    }}
                                >
                                    📷
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                />
                            </>
                        )}
                    </div>

                    <h1 style={{ margin: '0 0 5px 0', color: '#333' }}>@{profileUser?.username}</h1>

                    {!isOwnProfile && (
                        <span style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                            Stai visitando un altro profilo
                        </span>
                    )}

                    {/* BOTTONI FOLLOW / CONTATTA (Solo se non è il mio profilo) */}
                    {!isOwnProfile && (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
                            <button
                                onClick={handleToggleFollow}
                                style={{
                                    backgroundColor: isFollowing ? 'white' : '#2e7d32',
                                    color: isFollowing ? '#2e7d32' : 'white',
                                    border: '1px solid #2e7d32',
                                    padding: '6px 15px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold'
                                }}
                            >
                                {isFollowing ? 'Smetti di seguire' : 'Segui'}
                            </button>
                            <button
                                onClick={handleContact}
                                style={{
                                    backgroundColor: '#e8f5e9', color: '#2e7d32', border: 'none',
                                    padding: '6px 15px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold'
                                }}
                            >
                                📩 Contatta
                            </button>
                        </div>
                    )}

                    {/* SEZIONE BIO (Visualizzazione / Modifica) */}
                    <div style={{ marginTop: '15px' }}>
                        {isOwnProfile && isEditingBio ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                                <textarea
                                    value={tempBio}
                                    onChange={e => setTempBio(e.target.value)}
                                    rows={3}
                                    style={{ width: '80%', padding: '8px', borderRadius: '4px', borderColor: '#ccc', fontFamily: 'inherit' }}
                                />
                                <div>
                                    <button onClick={() => setIsEditingBio(false)} style={{ marginRight: '5px', cursor: 'pointer', background:'none', border:'none', textDecoration:'underline' }}>Annulla</button>
                                    <button onClick={handleSaveBio} style={{ backgroundColor: '#2e7d32', color: 'white', border: 'none', padding: '5px 15px', borderRadius: '4px', cursor: 'pointer' }}>Salva</button>
                                </div>
                            </div>
                        ) : (
                            <p style={{ color: '#666', fontStyle: 'italic', position: 'relative', display: 'inline-block', maxWidth: '80%' }}>
                                {profileUser?.bio || "Nessuna biografia inserita."}
                                {isOwnProfile && (
                                    <span
                                        onClick={() => setIsEditingBio(true)}
                                        style={{ cursor: 'pointer', marginLeft: '8px', fontSize: '16px' }}
                                        title="Modifica Bio"
                                    >
                                        ✏️
                                    </span>
                                )}
                            </p>
                        )}
                    </div>

                    {isOwnProfile && <p style={{ fontSize: '14px', color: '#888' }}>{profileUser?.email}</p>}

                    {/* STATISTICHE (Cliccabili) */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '25px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                        <div style={{ textAlign: 'center' }}>
                            <strong style={{ display: 'block', fontSize: '20px', color: '#333' }}>{posts.length}</strong>
                            <span style={{ color: '#666', fontSize: '14px' }}>Posts</span>
                        </div>

                        <div
                            onClick={() => setModalType('FOLLOWERS')}
                            style={{ textAlign: 'center', cursor: 'pointer', transition: 'opacity 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                        >
                            <strong style={{ display: 'block', fontSize: '20px', color: '#333' }}>
                                {profileUser?.followers?.length || 0}
                            </strong>
                            <span style={{ color: '#2e7d32', fontSize: '14px', fontWeight: 'bold', textDecoration: 'underline' }}>Followers</span>
                        </div>

                        <div
                            onClick={() => setModalType('FOLLOWING')}
                            style={{ textAlign: 'center', cursor: 'pointer', transition: 'opacity 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                        >
                            <strong style={{ display: 'block', fontSize: '20px', color: '#333' }}>
                                {profileUser?.following?.length || 0}
                            </strong>
                            <span style={{ color: '#2e7d32', fontSize: '14px', fontWeight: 'bold', textDecoration: 'underline' }}>Following</span>
                        </div>
                    </div>

                    {/* RICHIESTA MODERATORE (Solo se profilo mio e non sono già mod) */}
                    {isOwnProfile && profileUser?.role !== 'MODERATOR' && (
                        <div style={{ marginTop: '20px', textAlign: 'center' }}>
                            {!isModRequestOpen ? (
                                <button
                                    onClick={() => setIsModRequestOpen(true)}
                                    style={{
                                        backgroundColor: 'transparent',
                                        border: '1px solid #ff9800',
                                        color: '#ef6c00',
                                        padding: '8px 16px',
                                        borderRadius: '20px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        fontSize: '14px'
                                    }}
                                >
                                    🛡️ Diventa Moderatore
                                </button>
                            ) : (
                                <div style={{ backgroundColor: '#fff3e0', padding: '15px', borderRadius: '8px', border: '1px solid #ffe0b2', marginTop: '10px' }}>
                                    <h4 style={{ margin: '0 0 10px 0', color: '#e65100' }}>Richiesta Moderazione</h4>
                                    <textarea
                                        placeholder="Perché vuoi diventare moderatore?"
                                        value={modMotivation}
                                        onChange={e => setModMotivation(e.target.value)}
                                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ffcc80', minHeight: '60px', marginBottom: '10px', fontFamily: 'inherit' }}
                                    />
                                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                        <button onClick={() => setIsModRequestOpen(false)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>Annulla</button>
                                        <button onClick={handleBecomeModerator} style={{ backgroundColor: '#ff9800', color: 'white', border: 'none', padding: '6px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Invia</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* --- SEZIONI POST --- */}

                {pendingPosts.length > 0 && (
                    <div style={{ marginBottom: '30px' }}>
                        <h3 style={{ color: '#f57c00', borderBottom: '2px solid #f57c00', paddingBottom: '10px' }}>
                            ⚠️ I tuoi post in attesa / Da rivedere
                        </h3>
                        {pendingPosts.map(post => (
                            <div key={post.id} style={{ marginBottom: '20px' }}>
                                {post.status === 'REQUIRES_CHANGES' && (
                                    <div style={{ backgroundColor: '#fff3e0', padding: '15px', borderRadius: '4px', marginBottom: '10px', border: '1px solid #ffb74d', color: '#e65100' }}>
                                        <strong>Il moderatore dice:</strong> "{post.moderatorNote}"
                                    </div>
                                )}
                                <PostCard
                                    post={post}
                                    isOwnPost={true}
                                    onDelete={handleDeletePost}
                                    onEdit={handleEditPost}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {rejectedPosts.length > 0 && (
                    <div style={{ marginBottom: '30px' }}>
                        <h3 style={{ color: '#d32f2f', borderBottom: '2px solid #d32f2f', paddingBottom: '10px' }}>
                            ❌ Post Rifiutati
                        </h3>
                        {rejectedPosts.map(post => (
                            <div key={post.id} style={{ marginBottom: '20px' }}>
                                <PostCard post={post} isOwnPost={true} onDelete={handleDeletePost} />
                                <div style={{ color: '#d32f2f', fontWeight: 'bold', marginTop: '-10px', padding: '10px', backgroundColor: '#ffebee', borderRadius: '0 0 8px 8px' }}>
                                    Motivo rifiuto: {post.moderatorNote}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div>
                    <h3 style={{ color: '#2e7d32', borderBottom: '2px solid #2e7d32', paddingBottom: '10px' }}>
                        {isOwnProfile ? "✅ I tuoi post pubblicati" : `✅ Post pubblicati da @${profileUser?.username}`}
                    </h3>
                    {approvedPosts.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#888', fontStyle: 'italic', padding: '20px' }}>
                            Nessun post pubblicato.
                        </p>
                    ) : (
                        approvedPosts.map(post => (
                            <PostCard
                                key={post.id}
                                post={post}
                                isOwnPost={isOwnProfile}
                                onDelete={isOwnProfile ? handleDeletePost : undefined}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* --- MODALI --- */}

            {modalType === 'FOLLOWERS' && profileUser?.followers && (
                <UserList
                    title="Followers"
                    users={profileUser.followers}
                    currentUserId={currentUser.id}
                    profileOwnerId={profileUser.id}
                    listType="FOLLOWERS"
                    onClose={() => { setModalType('NONE'); loadProfileData(); }}
                />
            )}

            {modalType === 'FOLLOWING' && profileUser?.following && (
                <UserList
                    title="Following"
                    users={profileUser.following}
                    currentUserId={currentUser.id}
                    profileOwnerId={profileUser.id}
                    listType="FOLLOWING"
                    onClose={() => { setModalType('NONE'); loadProfileData(); }}
                />
            )}

            {editingPost && currentUser && (
                <EditPost
                    post={editingPost}
                    userId={currentUser.id}
                    onClose={() => setEditingPost(null)}
                    onUpdateSuccess={loadProfileData}
                />
            )}
        </div>
    );
}