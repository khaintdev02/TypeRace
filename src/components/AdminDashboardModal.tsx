import React, { useState } from 'react';
import { X, Shield, BookOpen, Plus, Trash2, Settings, Users, Check } from 'lucide-react';
import { getAllTexts, addCustomText, deleteCustomText } from '../data/typingTexts';
import type { TypingText } from '../game/raceTypes';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'passages' | 'settings' | 'users'>('passages');
  const [texts, setTexts] = useState<TypingText[]>(() => getAllTexts());

  // New passage form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState<'en' | 'vi'>('en');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [category, setCategory] = useState('technology');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddPassage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    addCustomText({
      title: title.trim(),
      content: content.trim(),
      language,
      difficulty,
      category
    });

    setTexts(getAllTexts());
    setTitle('');
    setContent('');
    setShowAddForm(false);
    setSuccessMsg('New passage has been added successfully to the library!');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleDeletePassage = (id: string) => {
    if (window.confirm('Are you sure you want to delete this passage?')) {
      deleteCustomText(id);
      setTexts(getAllTexts());
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 8, 15, 0.9)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1.5rem'
    }}>
      <div 
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '880px',
          height: '85vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.9), 0 0 40px rgba(245, 158, 11, 0.15)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.5rem 2rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(15, 23, 42, 0.4)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(245, 158, 11, 0.4)'
            }}>
              <Shield size={22} color="#070a12" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 900, margin: 0 }}>
                TypeRace <span className="title-gold">Admin Console</span>
              </h2>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                System-level passage library and multiplayer room control
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer'
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          padding: '0 2rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(10, 16, 28, 0.6)'
        }}>
          <button
            onClick={() => setActiveTab('passages')}
            style={{
              padding: '1rem 0.5rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'passages' ? '3px solid #f59e0b' : '3px solid transparent',
              color: activeTab === 'passages' ? '#f59e0b' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <BookOpen size={16} /> Passage Library ({texts.length})
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            style={{
              padding: '1rem 0.5rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'settings' ? '3px solid #f59e0b' : '3px solid transparent',
              color: activeTab === 'settings' ? '#f59e0b' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Settings size={16} /> Race Parameters
          </button>

          <button
            onClick={() => setActiveTab('users')}
            style={{
              padding: '1rem 0.5rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'users' ? '3px solid #f59e0b' : '3px solid transparent',
              color: activeTab === 'users' ? '#f59e0b' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Users size={16} /> Role Privileges
          </button>
        </div>

        {/* Content Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
          {successMsg && (
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid #10b981',
              color: '#34d399',
              fontSize: '0.85rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Check size={16} /> {successMsg}
            </div>
          )}

          {/* TAB 1: PASSAGES */}
          {activeTab === 'passages' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Manage Race Passages</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Create or remove typing quotes available for solo and multiplayer races</p>
                </div>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="btn btn-primary"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                  <Plus size={16} /> {showAddForm ? 'Close Form' : 'Add New Passage'}
                </button>
              </div>

              {/* Add Passage Form */}
              {showAddForm && (
                <form 
                  onSubmit={handleAddPassage}
                  style={{
                    background: 'rgba(15, 23, 42, 0.7)',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(0, 240, 255, 0.3)',
                    marginBottom: '1.75rem'
                  }}
                >
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#00f0ff', marginBottom: '1rem' }}>
                    Create New Target Passage
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: '0.25rem' }}>Title *</label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Velocity & Focus"
                        style={{
                          width: '100%',
                          padding: '0.6rem 0.8rem',
                          borderRadius: '8px',
                          background: '#090e1a',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          color: '#fff',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: '0.25rem' }}>Language</label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as 'en' | 'vi')}
                        style={{
                          width: '100%',
                          padding: '0.6rem 0.8rem',
                          borderRadius: '8px',
                          background: '#090e1a',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          color: '#fff',
                          outline: 'none'
                        }}
                      >
                        <option value="en">🇬🇧 English</option>
                        <option value="vi">🇻🇳 Vietnamese</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: '0.25rem' }}>Difficulty</label>
                      <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                        style={{
                          width: '100%',
                          padding: '0.6rem 0.8rem',
                          borderRadius: '8px',
                          background: '#090e1a',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          color: '#fff',
                          outline: 'none'
                        }}
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: '0.25rem' }}>Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.6rem 0.8rem',
                          borderRadius: '8px',
                          background: '#090e1a',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          color: '#fff',
                          outline: 'none'
                        }}
                      >
                        <option value="technology">Technology</option>
                        <option value="coding">Coding</option>
                        <option value="life">Philosophy</option>
                        <option value="proverbs">Literature</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: '0.25rem' }}>Passage Text *</label>
                    <textarea
                      rows={3}
                      required
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Type or paste the complete passage here..."
                      style={{
                        width: '100%',
                        padding: '0.7rem',
                        borderRadius: '8px',
                        background: '#090e1a',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: '#fff',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.85rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }}>
                    Save Passage to Library
                  </button>
                </form>
              )}

              {/* Passages List Table */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.5)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                overflow: 'hidden'
              }}>
                {texts.map((t) => (
                  <div
                    key={t.id}
                    style={{
                      padding: '1rem 1.25rem',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem'
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                        <strong style={{ color: '#fff', fontSize: '0.95rem' }}>{t.title}</strong>
                        <span style={{
                          fontSize: '0.7rem',
                          padding: '0.1rem 0.5rem',
                          borderRadius: '4px',
                          background: t.language === 'en' ? 'rgba(0, 240, 255, 0.15)' : 'rgba(168, 85, 247, 0.15)',
                          color: t.language === 'en' ? '#00f0ff' : '#c084fc',
                          fontWeight: 700
                        }}>
                          {t.language.toUpperCase()}
                        </span>
                        <span style={{
                          fontSize: '0.7rem',
                          padding: '0.1rem 0.5rem',
                          borderRadius: '4px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: '#cbd5e1',
                          textTransform: 'capitalize'
                        }}>
                          {t.difficulty}
                        </span>
                      </div>
                      <div style={{
                        fontSize: '0.8rem',
                        color: '#94a3b8',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        "{t.content}"
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {t.content.length} chars
                      </span>
                      {t.id.startsWith('custom_') && (
                        <button
                          onClick={() => handleDeletePassage(t.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            padding: '0.3rem'
                          }}
                          title="Delete passage"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: SETTINGS (No Firebase keys/secrets shown!) */}
          {activeTab === 'settings' && (
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem' }}>Race Environment & Engine</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Operational rules governing live typing matches and track physics
              </p>

              <div style={{
                background: 'rgba(15, 23, 42, 0.5)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '1.5rem',
                marginBottom: '1.5rem'
              }}>
                <strong style={{ color: '#fff', display: 'block', marginBottom: '1rem', fontSize: '1rem' }}>Active Engine Parameters</strong>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div style={{ padding: '1rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)' }}>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Max Racers / Room</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#00f0ff' }}>8 Players</div>
                  </div>
                  <div style={{ padding: '1rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)' }}>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Countdown Start</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f59e0b' }}>3.0 Seconds</div>
                  </div>
                  <div style={{ padding: '1rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)' }}>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Progress Throttle</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981' }}>300 ms</div>
                  </div>
                </div>
              </div>

              <div style={{
                background: 'rgba(15, 23, 42, 0.5)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '1.5rem'
              }}>
                <strong style={{ color: '#fff', display: 'block', marginBottom: '0.5rem' }}>Engine Integrity Rules</strong>
                <ul style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.8, paddingLeft: '1.25rem' }}>
                  <li>Global standard WPM math: <code>(valid characters / 5) / elapsed minutes</code>.</li>
                  <li>Client-side prediction with server-anchored <code>startAt</code> timestamps.</li>
                  <li>Unicode Normalization Form C (NFC) for international IME compatibility.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: USERS & ROLES (No passwords exposed!) */}
          {activeTab === 'users' && (
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem' }}>Role Privileges</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                System hierarchy between <strong>Admin</strong> and <strong>Player</strong>
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1rem'
              }}>
                {/* Admin Card */}
                <div style={{
                  background: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '12px',
                  padding: '1.25rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <Shield size={20} color="#f59e0b" />
                    <strong style={{ color: '#f59e0b', fontSize: '1rem' }}>Administrator Role</strong>
                  </div>
                  <p style={{ color: '#cbd5e1', fontSize: '0.85rem', lineHeight: 1.5 }}>
                    Full authority to add, edit, or delete typing quotes in the system, supervise race rooms, and adjust operational settings.
                  </p>
                </div>

                {/* Player Card */}
                <div style={{
                  background: 'rgba(0, 240, 255, 0.08)',
                  border: '1px solid rgba(0, 240, 255, 0.3)',
                  borderRadius: '12px',
                  padding: '1.25rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <Users size={20} color="#00f0ff" />
                    <strong style={{ color: '#00f0ff', fontSize: '1rem' }}>Player Role</strong>
                  </div>
                  <p style={{ color: '#cbd5e1', fontSize: '0.85rem', lineHeight: 1.5 }}>
                    Access to solo practice, custom multiplayer room creation, custom vehicle & color loadout, and personal leaderboard records.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
