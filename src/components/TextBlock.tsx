import React from 'react';
import { useNode } from '@craftjs/core';

interface TextBlockProps {
  text?: string;
  fontSize?: number;
  alignment?: 'left' | 'center' | 'right';
  backgroundColor?: string;
}

const TextBlockComponent: React.FC<TextBlockProps> = ({
  text = 'Edit this text',
  fontSize = 16,
  alignment = 'left',
  backgroundColor = '#ffffff',
}) => {
  const { selected, connectors } = useNode((state) => ({
    selected: state.events.selected,
  }));

  return (
    <div
      ref={connectors.connect as any}
      style={{
        backgroundColor,
        padding: '30px 40px',
        border: selected ? '2px solid #3b82f6' : 'none',
      }}
    >
      <p
        style={{
          fontSize: `${fontSize}px`,
          textAlign: alignment,
          margin: 0,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          color: '#1f2937',
          lineHeight: '1.6',
        }}
        contentEditable
        suppressContentEditableWarning
      >
        {text}
      </p>
    </div>
  );
};

export const TextBlock = TextBlockComponent;

TextBlock.craft = {
  displayName: 'Text Block',
  props: {
    text: 'Edit this text',
    fontSize: 16,
    alignment: 'left',
    backgroundColor: '#ffffff',
  },
};
