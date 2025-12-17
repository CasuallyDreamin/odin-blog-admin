'use client';

import React, { useState, useEffect } from 'react';
import { fetchSettings, updateSettings, BlogSettings, UpdateSettingsPayload } from '@/lib/settingsService';
import FormField from '@/components/admin/FormField'; 

interface SocialLink {
  platform: string;
  url: string;
}

type SettingsFormData = UpdateSettingsPayload;

const ensureString = (value: string | number | null | undefined): string => {
    return (value === null || value === undefined) ? '' : String(value);
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<BlogSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formState, setFormState] = useState<SettingsFormData>({} as SettingsFormData);
  const [socialLinksArray, setSocialLinksArray] = useState<SocialLink[]>([]);

  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const data = await fetchSettings();
        setSettings(data);
        
        setFormState({
            blogName: ensureString(data.blogName),
            tagline: ensureString(data.tagline),
            logoUrl: ensureString(data.logoUrl),
            theme: ensureString(data.theme),
            postsPerPage: data.postsPerPage || 10,
            seoTitle: ensureString(data.seoTitle),
            seoDescription: ensureString(data.seoDescription),
            socialLinks: data.socialLinks,
        });
        
        if (data.socialLinks) {
            const linkArray: SocialLink[] = Object.entries(data.socialLinks).map(([platform, url]) => ({
                platform,
                url
            }));
            setSocialLinksArray(linkArray);
        } else {
            setSocialLinksArray([]);
        }

      } catch (err) {
        setError(`Failed to load settings: ${(err as Error).message}`);
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleChange = (name: keyof SettingsFormData) => (value: string) => {
    setFormState(prev => ({
      ...prev,
      [name]: name === 'postsPerPage' ? parseInt(value) : value,
    }));
  };

  const addSocialLink = () => {
    setSocialLinksArray(prev => [
        ...prev,
        { platform: '', url: '' }
    ]);
  };

  const removeSocialLink = (index: number) => {
    setSocialLinksArray(prev => prev.filter((_, i) => i !== index));
  };

  const handleSocialLinkChange = (index: number, field: keyof SocialLink, value: string) => {
    setSocialLinksArray(prev => prev.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const socialLinksObject: Record<string, string> = socialLinksArray.reduce((acc, link) => {
        if (link.platform && link.url) {
            acc[link.platform.toLowerCase().trim()] = link.url;
        }
        return acc;
    }, {} as Record<string, string>);

    const payload: UpdateSettingsPayload = {
        ...formState,
        postsPerPage: Number(formState.postsPerPage),
        socialLinks: socialLinksObject,
    };

    try {
      const updatedData = await updateSettings(payload);
      
      setSettings(updatedData);
      setFormState({
          blogName: ensureString(updatedData.blogName),
          tagline: ensureString(updatedData.tagline),
          logoUrl: ensureString(updatedData.logoUrl),
          theme: ensureString(updatedData.theme),
          postsPerPage: updatedData.postsPerPage,
          seoTitle: ensureString(updatedData.seoTitle),
          seoDescription: ensureString(updatedData.seoDescription),
          socialLinks: updatedData.socialLinks,
      });

      if (updatedData.socialLinks) {
          const linkArray: SocialLink[] = Object.entries(updatedData.socialLinks).map(([platform, url]) => ({
              platform,
              url
          }));
          setSocialLinksArray(linkArray);
      }
      
      console.log('Settings updated:', updatedData);
      alert('Settings saved successfully!'); 

    } catch (err) {
      setError(`Failed to save settings: ${(err as Error).message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div>Loading Settings...</div>;
  }

  if (error && !settings) {
    return <div className="p-4 border rounded">Error: {error}</div>;
  }

  if (!settings) return <div>No settings data available.</div>;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Blog Settings</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        
        {error && 
          <p className="p-3 rounded">Error: {error}</p>
        }

        <section className="p-6 shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-4">General Configuration</h2>
          
          <FormField 
            label="Blog Name" 
            placeholder="My Awesome Blog"
            value={formState.blogName || ''}
            onChange={handleChange('blogName')}
            required
          />

          <FormField 
            label="Tagline" 
            type="textarea"
            placeholder="A short description used in the header."
            value={formState.tagline || ''}
            onChange={handleChange('tagline')}
          />

          <FormField 
            label="Posts Per Page (Public)" 
            type="number"
            placeholder="10"
            value={formState.postsPerPage || 10}
            onChange={handleChange('postsPerPage')}
            required
          />
          
          <FormField 
            label="Default Theme" 
            type="select"
            value={formState.theme || 'default'}
            onChange={handleChange('theme')}
            options={['default', 'light', 'dark']}
          />
          
          <FormField 
            label="Logo URL" 
            placeholder="https://example.com/logo.png"
            type="url"
            value={formState.logoUrl || ''}
            onChange={handleChange('logoUrl')}
          />
        </section>


        <section className="p-6 shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-4">SEO & Metadata</h2>
          
          <FormField 
            label="Default SEO Title" 
            placeholder="My Blog - Home"
            value={formState.seoTitle || ''}
            onChange={handleChange('seoTitle')}
          />

          <FormField 
            label="Default SEO Description" 
            value={formState.seoDescription || ''}
            type="textarea"
            placeholder="The official blog for..."
            onChange={handleChange('seoDescription')}
          />
        </section>


        <section className="p-6 shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Social Media Links</h2>
          
          <div className="flex flex-col gap-3">
            {socialLinksArray.map((link, index) => (
                <div key={index} className="flex gap-3 items-center">
                    <input
                        placeholder="Platform (e.g., Twitter)"
                        value={link.platform}
                        onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                        className="flex-1 border rounded"
                    />
                    <input
                        placeholder="URL (e.g., https://twitter.com/myblog)"
                        value={link.url}
                        onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                        className="flex-2 border rounded"
                    />
                    <button 
                      type="button" 
                      onClick={() => removeSocialLink(index)} 
                      className="p-2 text-lg" 
                    >
                      &times;
                    </button>
                </div>
            ))}
          </div>

          <button 
            type="button" 
            onClick={addSocialLink} 
            className="mt-4 px-3 py-1 rounded border"
          >
            + Add Social Link
          </button>
        </section>

        <div className="flex justify-end sticky bottom-0 p-4 border-t">
            <button 
              type="submit" 
              disabled={isSaving} 
              className={`px-6 py-2 rounded font-semibold transition`}
            >
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
        </div>
      </form>
    </div>
  );
}