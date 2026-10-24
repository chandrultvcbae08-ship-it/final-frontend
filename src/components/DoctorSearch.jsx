import React from 'react';
import { Search, X } from 'lucide-react';

const DoctorSearch = ({ searchTerm, setSearchTerm, onSearch }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch();
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '640px', position: 'relative' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        border: '1.5px solid var(--border-color)',
        borderRadius: 'var(--radius-full)',
        padding: '6px 8px 6px 18px',
        boxShadow: 'var(--shadow-sm)',
        transition: 'all 0.2s ease'
      }}>
        <Search size={20} color="var(--primary)" style={{ flexShrink: 0, marginRight: '10px' }} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by doctor name, specialization, hospital, or city..."
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: '0.95rem',
            color: 'var(--text-main)',
            backgroundColor: 'transparent'
          }}
        />

        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-light)',
              display: 'flex',
              alignItems: 'center',
              padding: '4px',
              marginRight: '6px'
            }}
          >
            <X size={18} />
          </button>
        )}

        <button type="submit" className="btn btn-primary btn-sm" style={{ borderRadius: 'var(--radius-full)', padding: '8px 20px' }}>
          Search
        </button>
      </div>
    </form>
  );
};

export default DoctorSearch;
