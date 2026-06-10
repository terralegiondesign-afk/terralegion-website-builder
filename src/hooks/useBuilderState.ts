import { useState, useEffect, useCallback } from 'react';

interface BootstrapData {
  clientId: number;
  clientName: string;
  website: {
    id: number | null;
    clientId: number;
    draft: any;
    published: any;
    deploymentStatus: 'not_started' | 'draft' | 'published' | 'archived';
    isLive: boolean;
    lastPublishedAt: string | null;
    customDomain: string | null;
    subdomain: string | null;
    apiToken: string | null;
  };
  apiEndpoints: {
    getWebsite: string;
    saveWebsite: string;
    publishWebsite: string;
    unpublishWebsite: string;
    archiveWebsite: string;
    rotateToken: string;
    publicRender: string;
    dashboard: string;
  };
  csrf: {
    tokenName: string;
    tokenValue: string;
  };
  baseUrl: string;
  user: {
    id: number | null;
    isAdmin: boolean;
  };
}

declare global {
  interface Window {
    TerraLegionBuilder?: BootstrapData;
  }
}

export const useBuilderState = () => {
  const [bootstrap, setBootstrap] = useState<BootstrapData | null>(null);
  const [draft, setDraft] = useState<any>(null);
  const [status, setStatus] = useState<'not_started' | 'draft' | 'published' | 'archived'>('draft');
  const [isLive, setIsLive] = useState(false);
  const [lastPublishedAt, setLastPublishedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize from window.TerraLegionBuilder
  useEffect(() => {
    const data = window.TerraLegionBuilder;
    if (!data) {
      setError('Bootstrap data not found. Page may not be loaded in the CRM editor context.');
      setLoading(false);
      return;
    }

    setBootstrap(data);
    setDraft(data.website.draft || { title: '', sections: [], metadata: {} });
    setStatus(data.website.deploymentStatus);
    setIsLive(data.website.isLive);
    setLastPublishedAt(data.website.lastPublishedAt);
    setLoading(false);
  }, []);

  const updateDraft = useCallback((updater: (prev: any) => any) => {
    setDraft((prev) => updater(prev));
  }, []);

  const refreshState = useCallback(async () => {
    if (!bootstrap) return;

    try {
      const response = await fetch(bootstrap.apiEndpoints.getWebsite);
      const json = await response.json();
      if (json.success && json.website) {
        setDraft(json.website.draft || json.website.website_json);
        setStatus(json.website.deployment_status || json.website.deploymentStatus);
        setIsLive(json.website.is_live || json.website.isLive);
        setLastPublishedAt(json.website.last_published_at || json.website.lastPublishedAt);
      }
    } catch (err) {
      console.error('Failed to refresh state:', err);
    }
  }, [bootstrap]);

  return {
    bootstrap,
    draft,
    status,
    isLive,
    lastPublishedAt,
    loading,
    error,
    updateDraft,
    refreshState,
  };
};
