import React, { useState } from 'react';

interface ToolbarProps {
  status: 'not_started' | 'draft' | 'published' | 'archived';
  isLive: boolean;
  lastPublishedAt: string | null;
  onSave?: () => Promise<void>;
  onPublish?: () => Promise<void>;
  onUnpublish?: () => Promise<void>;
  onRotateToken?: () => Promise<void>;
  apiToken?: string | null;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'published':
      return '#dcfce7';
    case 'draft':
      return '#fef3c7';
    case 'archived':
      return '#f3f4f6';
    default:
      return '#e2e8f0';
  }
};

const getStatusTextColor = (status: string) => {
  switch (status) {
    case 'published':
      return '#166534';
    case 'draft':
      return '#92400e';
    case 'archived':
      return '#374151';
    default:
      return '#475569';
  }
};

export const Toolbar: React.FC<ToolbarProps> = ({
  status,
  isLive,
  lastPublishedAt,
  onSave,
  onPublish,
  onUnpublish,
  onRotateToken,
  apiToken,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showToken, setShowToken] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave?.();
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      if (isLive) {
        await onUnpublish?.();
      } else {
        await onPublish?.();
      }
    } catch (err) {
      console.error('Publish/Unpublish failed:', err);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleRotateToken = async () => {
    try {
      await onRotateToken?.();
      setShowToken(true);
      setTimeout(() => setShowToken(false), 5000);
    } catch (err) {
      console.error('Token rotation failed:', err);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 16px',
        backgroundColor: '#fff',
        borderBottom: '1px solid #e3e6ec',
        gap: '16px',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span
          style={{
            display: 'inline-block',
            padding: '4px 12px',
            fontSize: '11px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            borderRadius: '999px',
            backgroundColor: getStatusColor(status),
            color: getStatusTextColor(status),
          }}
        >
          {status}
        </span>
        {lastPublishedAt && (
          <span style={{ fontSize: '12px', color: '#666' }}>
            Published: {new Date(lastPublishedAt).toLocaleDateString()} {new Date(lastPublishedAt).toLocaleTimeString()}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button
          onClick={handleSave}
          disabled={isSaving}
          style={{
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: '500',
            backgroundColor: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: isSaving ? 'not-allowed' : 'pointer',
            opacity: isSaving ? 0.6 : 1,
          }}
        >
          {isSaving ? 'Saving...' : 'Save Draft'}
        </button>

        <button
          onClick={handlePublish}
          disabled={isPublishing}
          style={{
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: '500',
            backgroundColor: isLive ? '#ef4444' : '#22c55e',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: isPublishing ? 'not-allowed' : 'pointer',
            opacity: isPublishing ? 0.6 : 1,
          }}
        >
          {isPublishing ? 'Updating...' : isLive ? 'Unpublish' : 'Publish'}
        </button>

        <button
          onClick={handleRotateToken}
          style={{
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: '500',
            backgroundColor: '#6b7280',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
          title="Generate a new API token for this site"
        >
          Rotate Token
        </button>
      </div>

      {showToken && apiToken && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: '#1f2937',
            color: '#fff',
            padding: '12px 16px',
            borderRadius: '6px',
            fontSize: '12px',
            fontFamily: 'monospace',
            maxWidth: '400px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div style={{ marginBottom: '8px' }}>New API Token (copy now):</div>
          <div style={{ wordBreak: 'break-all' }}>{apiToken}</div>
        </div>
      )}
    </div>
  );
};
