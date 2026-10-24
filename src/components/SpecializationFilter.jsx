import React from 'react';

const SpecializationFilter = ({ specializations = [], selected, onSelect }) => {
  const allSpecializations = ['All', ...specializations];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      overflowX: 'auto',
      paddingBottom: '8px',
      WebkitOverflowScrolling: 'touch'
    }}>
      {allSpecializations.map((spec) => {
        const isSelected = selected === spec || (spec === 'All' && !selected);
        return (
          <button
            key={spec}
            type="button"
            onClick={() => onSelect(spec === 'All' ? '' : spec)}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-color)',
              backgroundColor: isSelected ? 'var(--primary)' : '#ffffff',
              color: isSelected ? '#ffffff' : 'var(--text-muted)',
              boxShadow: isSelected ? '0 2px 8px rgba(37, 99, 235, 0.25)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            {spec}
          </button>
        );
      })}
    </div>
  );
};

export default SpecializationFilter;
