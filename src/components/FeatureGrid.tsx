import React from 'react';
import { useNode } from '@craftjs/core';

interface Feature {
  title: string;
  description: string;
}

interface FeatureGridProps {
  features?: Feature[];
  backgroundColor?: string;
}

const FeatureGridComponent: React.FC<FeatureGridProps> = ({
  features = [
    { title: 'Feature One', description: 'Description here' },
    { title: 'Feature Two', description: 'Description here' },
    { title: 'Feature Three', description: 'Description here' },
  ],
  backgroundColor = '#f9fafb',
}) => {
  const { selected, connectors } = useNode((state) => ({
    selected: state.events.selected,
  }));

  return (
    <div
      ref={connectors.connect as any}
      style={{
        backgroundColor,
        padding: '60px 40px',
        border: selected ? '2px solid #3b82f6' : 'none',
      }}
    >
      <h2
        style={{
          fontSize: '36px',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '50px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
        contentEditable
        suppressContentEditableWarning
      >
        Our Features
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '30px',
        }}
      >
        {features.map((feature, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: '#ffffff',
              padding: '30px',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h3
              style={{
                fontSize: '20px',
                fontWeight: 'bold',
                marginBottom: '12px',
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}
              contentEditable
              suppressContentEditableWarning
            >
              {feature.title}
            </h3>
            <p
              style={{
                fontSize: '14px',
                color: '#666',
                margin: 0,
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}
              contentEditable
              suppressContentEditableWarning
            >
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const FeatureGrid = FeatureGridComponent;

FeatureGrid.craft = {
  displayName: 'Feature Grid',
  props: {
    features: [
      { title: 'Feature One', description: 'Description here' },
      { title: 'Feature Two', description: 'Description here' },
      { title: 'Feature Three', description: 'Description here' },
    ],
    backgroundColor: '#f9fafb',
  },
};
