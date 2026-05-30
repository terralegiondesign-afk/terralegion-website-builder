import React from 'react';
import { Editor, Frame, Element } from '@craftjs/core';
import { HeroSection, FeatureGrid, TextBlock } from './components';

interface EditorProps {
  initialContent: any;
  onContentChange?: (content: any) => void;
}

export const EditorComponent: React.FC<EditorProps> = ({ initialContent, onContentChange }) => {
  return (
    <Editor
      resolver={{
        HeroSection,
        FeatureGrid,
        TextBlock,
      }}
      onchange={(query) => {
        if (onContentChange) {
          // When canvas changes, trigger the parent to update
          onContentChange(query.serialize());
        }
      }}
    >
      <div style={{ padding: '20px', backgroundColor: '#f5f6f8', minHeight: '100%' }}>
        <div
          style={{
            backgroundColor: '#fff',
            borderRadius: '6px',
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)',
            overflow: 'hidden',
          }}
        >
          <Frame>
            <Element is={HeroSection} canvas>
              {initialContent?.sections && initialContent.sections.length > 0 ? (
                initialContent.sections.map((section: any, idx: number) => {
                  if (section.type === 'hero') {
                    return (
                      <Element key={idx} is={HeroSection} canvas>
                        {section.title && <div>{section.title}</div>}
                      </Element>
                    );
                  }
                  if (section.type === 'features') {
                    return (
                      <Element key={idx} is={FeatureGrid} canvas>
                        {section.title && <div>{section.title}</div>}
                      </Element>
                    );
                  }
                  if (section.type === 'text') {
                    return (
                      <Element key={idx} is={TextBlock} canvas>
                        {section.text && <div>{section.text}</div>}
                      </Element>
                    );
                  }
                  return null;
                })
              ) : (
                <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                  Drag components here to start building
                </div>
              )}
            </Element>
          </Frame>
        </div>
      </div>
    </Editor>
  );
};
