import React from 'react';
import { useNode } from '@craftjs/core';

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  backgroundColor?: string;
  textColor?: string;
}

const HeroSectionComponent: React.FC<HeroSectionProps> = ({
  title = 'Welcome to Your Site',
  subtitle = 'Create something amazing',
  buttonText = 'Get Started',
  backgroundColor = '#3b82f6',
  textColor = '#ffffff',
}) => {
  const { selected, connectors } = useNode((state) => ({
    selected: state.events.selected,
  }));

  return (
    <div
      ref={connectors.connect as any}
      style={{
        backgroundColor,
        color: textColor,
        padding: '80px 40px',
        textAlign: 'center',
        minHeight: '300px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        border: selected ? '2px solid #3b82f6' : 'none',
      }}
    >
      <h1
        style={{
          fontSize: '48px',
          fontWeight: 'bold',
          margin: '0 0 20px 0',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
        contentEditable
        suppressContentEditableWarning
      >
        {title}
      </h1>
      <p
        style={{
          fontSize: '20px',
          margin: '0 0 30px 0',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
        contentEditable
        suppressContentEditableWarning
      >
        {subtitle}
      </p>
      <button
        style={{
          backgroundColor: '#1e40af',
          color: textColor,
          padding: '12px 30px',
          fontSize: '16px',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        {buttonText}
      </button>
    </div>
  );
};

export const HeroSection = HeroSectionComponent;

HeroSection.craft = {
  displayName: 'Hero Section',
  props: {
    title: 'Welcome to Your Site',
    subtitle: 'Create something amazing',
    buttonText: 'Get Started',
    backgroundColor: '#3b82f6',
    textColor: '#ffffff',
  },
};
