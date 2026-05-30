import React, { useState, useEffect } from 'react';
import { useBuilderState } from './hooks/useBuilderState';
import { useAPI } from './hooks/useAPI';
import { EditorComponent } from './Editor';
import { Toolbar } from './Toolbar';

export const App: React.FC = () => {
  const { bootstrap, draft, status, isLive, lastPublishedAt, loading, error, updateDraft, refreshState } =
    useBuilderState();

  const [newToken, setNewToken] = useState<string | null>(null);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#f5f6f8',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              border: '3px solid #e2e8f0',
              borderTopColor: '#3b82f6',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 16px',
            }}
          />
          <p style={{ color: '#64748b' }}>Loading editor…</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (error || !bootstrap) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#fef2f2',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div style={{ textAlign: 'center', color: '#991b1b' }}>
          <h2 style={{ margin: '0 0 12px' }}>⚠️ Editor Bootstrap Failed</h2>
          <p style={{ margin: '0 0 12px' }}>{error || 'window.TerraLegionBuilder not found'}</p>
          <p style={{ margin: 0, fontSize: '14px', color: '#7f1d1d' }}>
            This editor must be loaded within the CRM editor view.
          </p>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    if (!bootstrap) return;

    try {
      const formData = new FormData();
      formData.append(bootstrap.csrf.tokenName, bootstrap.csrf.tokenValue);
      formData.append('website_json', JSON.stringify(draft));

      const response = await fetch(bootstrap.apiEndpoints.saveWebsite, {
        method: 'POST',
        body: formData,
      });

      const json = await response.json();
      if (json.success) {
        await refreshState();
        console.log('Save successful');
      } else {
        console.error('Save failed:', json.message);
      }
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  const handlePublish = async () => {
    if (!bootstrap) return;

    try {
      const formData = new FormData();
      formData.append(bootstrap.csrf.tokenName, bootstrap.csrf.tokenValue);

      const response = await fetch(bootstrap.apiEndpoints.publishWebsite, {
        method: 'POST',
        body: formData,
      });

      const json = await response.json();
      if (json.success) {
        await refreshState();
        console.log('Publish successful');
      } else {
        console.error('Publish failed:', json.message);
      }
    } catch (err) {
      console.error('Publish error:', err);
    }
  };

  const handleUnpublish = async () => {
    if (!bootstrap) return;

    try {
      const formData = new FormData();
      formData.append(bootstrap.csrf.tokenName, bootstrap.csrf.tokenValue);

      const response = await fetch(bootstrap.apiEndpoints.unpublishWebsite, {
        method: 'POST',
        body: formData,
      });

      const json = await response.json();
      if (json.success) {
        await refreshState();
        console.log('Unpublish successful');
      } else {
        console.error('Unpublish failed:', json.message);
      }
    } catch (err) {
      console.error('Unpublish error:', err);
    }
  };

  const handleRotateToken = async () => {
    if (!bootstrap) return;

    try {
      const formData = new FormData();
      formData.append(bootstrap.csrf.tokenName, bootstrap.csrf.tokenValue);

      const response = await fetch(bootstrap.apiEndpoints.rotateToken, {
        method: 'POST',
        body: formData,
      });

      const json = await response.json();
      if (json.success && json.api_token) {
        setNewToken(json.api_token);
        await refreshState();
        console.log('Token rotated');
      } else {
        console.error('Token rotation failed:', json.message);
      }
    } catch (err) {
      console.error('Token rotation error:', err);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#f5f6f8',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <Toolbar
        status={status}
        isLive={isLive}
        lastPublishedAt={lastPublishedAt}
        onSave={handleSave}
        onPublish={handlePublish}
        onUnpublish={handleUnpublish}
        onRotateToken={handleRotateToken}
        apiToken={newToken}
      />

      <div style={{ flex: 1, overflow: 'auto' }}>
        <EditorComponent
          initialContent={draft}
          onContentChange={(content) => {
            updateDraft(() => content);
          }}
        />
      </div>
    </div>
  );
};
