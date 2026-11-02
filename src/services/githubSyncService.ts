import { AdminTeamMember, AdminPartner, AdminEvent } from '../types/admin';

const GITHUB_TOKEN_KEY = 'hope_together_github_token';
const GITHUB_OWNER_KEY = 'hope_together_github_owner';
const GITHUB_REPO_KEY = 'hope_together_github_repo';
const GITHUB_BRANCH_KEY = 'hope_together_github_branch';
const GITHUB_AUTOSYNC_KEY = 'hope_together_github_autosync';

const DEFAULT_OWNER = 'hafeezahmadyt';
const DEFAULT_REPO = 'Hope-Together-WEB';
const DEFAULT_BRANCH = 'main';

export interface GitHubSyncSettings {
  token: string;
  owner: string;
  repo: string;
  branch: string;
  autoSync: boolean;
}

function utf8ToBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function slugify(text: string): string {
  const clean = text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return clean || `item-${Date.now()}`;
}

export function slugifyMemberName(name: string): string {
  return slugify(name);
}

function extractBase64AndExt(dataUrlOrBase64: string, defaultExt = 'jpg'): { base64: string; ext: string } {
  const match = dataUrlOrBase64.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/s);
  if (match) {
    let mime = match[1].toLowerCase();
    if (mime === 'jpeg') mime = 'jpg';
    if (mime.includes('svg')) mime = 'svg';
    return {
      ext: mime,
      base64: match[2].trim(),
    };
  }
  return {
    ext: defaultExt,
    base64: dataUrlOrBase64.replace(/^data:image\/[a-z0-9+.-]+;base64,/i, '').trim(),
  };
}

export const githubSyncService = {
  getSettings(): GitHubSyncSettings {
    try {
      return {
        token: localStorage.getItem(GITHUB_TOKEN_KEY) || '',
        owner: localStorage.getItem(GITHUB_OWNER_KEY) || DEFAULT_OWNER,
        repo: localStorage.getItem(GITHUB_REPO_KEY) || DEFAULT_REPO,
        branch: localStorage.getItem(GITHUB_BRANCH_KEY) || DEFAULT_BRANCH,
        autoSync: localStorage.getItem(GITHUB_AUTOSYNC_KEY) !== 'false',
      };
    } catch {
      return {
        token: '',
        owner: DEFAULT_OWNER,
        repo: DEFAULT_REPO,
        branch: DEFAULT_BRANCH,
        autoSync: true,
      };
    }
  },

  saveSettings(settings: Partial<GitHubSyncSettings>): void {
    try {
      if (settings.token !== undefined) localStorage.setItem(GITHUB_TOKEN_KEY, settings.token.trim());
      if (settings.owner !== undefined) localStorage.setItem(GITHUB_OWNER_KEY, settings.owner.trim());
      if (settings.repo !== undefined) localStorage.setItem(GITHUB_REPO_KEY, settings.repo.trim());
      if (settings.branch !== undefined) localStorage.setItem(GITHUB_BRANCH_KEY, settings.branch.trim());
      if (settings.autoSync !== undefined) localStorage.setItem(GITHUB_AUTOSYNC_KEY, String(settings.autoSync));

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('hope_together_github_settings_changed'));
      }
    } catch {
      // Ignore
    }
  },

  isConfigured(): boolean {
    const s = this.getSettings();
    return Boolean(s.token && s.token.length > 10);
  },

  async testConnection(): Promise<{ success: boolean; user?: string; error?: string }> {
    const s = this.getSettings();
    if (!s.token) {
      return { success: false, error: 'No GitHub Personal Access Token provided.' };
    }

    try {
      const res = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${s.token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (!res.ok) {
        if (res.status === 401) return { success: false, error: 'Invalid or expired GitHub Token (401 Unauthorized).' };
        return { success: false, error: `GitHub API returned HTTP ${res.status}` };
      }

      const userData = await res.json();

      // Also verify write access to target repository
      const repoRes = await fetch(`https://api.github.com/repos/${s.owner}/${s.repo}`, {
        headers: {
          Authorization: `Bearer ${s.token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (!repoRes.ok) {
        return {
          success: false,
          error: `Authenticated as "${userData.login}", but cannot access repo ${s.owner}/${s.repo} (HTTP ${repoRes.status}). Verify permissions.`,
        };
      }

      return { success: true, user: userData.login };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Network error connecting to GitHub API.' };
    }
  },

  async getFileSha(path: string): Promise<string | null> {
    const s = this.getSettings();
    try {
      const res = await fetch(
        `https://api.github.com/repos/${s.owner}/${s.repo}/contents/${path}?ref=${s.branch}`,
        {
          headers: {
            Authorization: `Bearer ${s.token}`,
            Accept: 'application/vnd.github.v3+json',
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        return data.sha || null;
      }
    } catch {
      // Return null on error / 404
    }
    return null;
  },

  async commitFile(
    path: string,
    base64Content: string,
    commitMessage: string
  ): Promise<{ success: boolean; sha?: string; error?: string }> {
    const s = this.getSettings();
    if (!s.token) {
      return { success: false, error: 'GitHub token is not configured.' };
    }

    try {
      const existingSha = await this.getFileSha(path);

      const body: Record<string, any> = {
        message: commitMessage,
        content: base64Content,
        branch: s.branch,
      };
      if (existingSha) {
        body.sha = existingSha;
      }

      const res = await fetch(
        `https://api.github.com/repos/${s.owner}/${s.repo}/contents/${path}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${s.token}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.message || `Failed to commit ${path} (HTTP ${res.status})`,
        };
      }

      const data = await res.json();
      return { success: true, sha: data.content?.sha };
    } catch (err: any) {
      return { success: false, error: err?.message || `Failed to commit ${path}` };
    }
  },

  /**
   * Upload an asset to a specific folder in GitHub (team, partners, events).
   */
  async uploadAsset(
    folder: 'team' | 'partners' | 'events',
    titleOrName: string,
    dataUrlOrBase64: string,
    defaultExt = 'jpg'
  ): Promise<{ success: boolean; url: string; error?: string }> {
    const slug = slugify(titleOrName);
    const { base64, ext } = extractBase64AndExt(dataUrlOrBase64, defaultExt);

    if (!base64) {
      return { success: false, url: dataUrlOrBase64, error: 'Invalid base64 asset data' };
    }

    const filename = `${slug}.${ext}`;
    const repoPath = `public/assets/${folder}/${filename}`;
    const publicUrl = `/assets/${folder}/${filename}`;

    const res = await this.commitFile(
      repoPath,
      base64,
      `CMS: Upload structured ${folder} asset for "${titleOrName}"`
    );

    if (!res.success) {
      return { success: false, url: dataUrlOrBase64, error: res.error };
    }

    return { success: true, url: publicUrl };
  },

  // Team Photo Upload
  async uploadPhoto(
    memberName: string,
    dataUrlOrBase64: string
  ): Promise<{ success: boolean; photoUrl: string; error?: string }> {
    const res = await this.uploadAsset('team', memberName, dataUrlOrBase64, 'png');
    return {
      success: res.success,
      photoUrl: res.url,
      error: res.error,
    };
  },

  // Partner Logo Upload
  async uploadPartnerLogo(
    partnerName: string,
    dataUrlOrBase64: string
  ): Promise<{ success: boolean; logoUrl: string; error?: string }> {
    const res = await this.uploadAsset('partners', partnerName, dataUrlOrBase64, 'png');
    return {
      success: res.success,
      logoUrl: res.url,
      error: res.error,
    };
  },

  // Event Cover / Gallery Image Upload (Supports up to 5 images)
  async uploadEventImage(
    eventTitle: string,
    dataUrlOrBase64: string,
    index?: number
  ): Promise<{ success: boolean; coverImageUrl: string; url: string; error?: string }> {
    const suffix = index !== undefined ? `-${index + 1}` : '';
    const name = `${eventTitle}${suffix}`;
    const res = await this.uploadAsset('events', name, dataUrlOrBase64, 'jpg');
    return {
      success: res.success,
      coverImageUrl: res.url,
      url: res.url,
      error: res.error,
    };
  },

  // Full Team Sync
  async syncFullTeamToGithub(
    members: AdminTeamMember[]
  ): Promise<{ success: boolean; deployedCount: number; members?: AdminTeamMember[]; error?: string }> {
    const s = this.getSettings();
    if (!s.token) {
      return { success: false, deployedCount: 0, error: 'GitHub token not configured.' };
    }

    try {
      const processedMembers: AdminTeamMember[] = [];
      let uploadedPhotos = 0;

      for (const m of members) {
        let finalPhotoUrl = m.photoUrl;

        if (finalPhotoUrl && finalPhotoUrl.startsWith('data:image/')) {
          const uploadRes = await this.uploadPhoto(m.name, finalPhotoUrl);
          if (uploadRes.success) {
            finalPhotoUrl = uploadRes.photoUrl;
            uploadedPhotos++;
          }
        }

        processedMembers.push({
          ...m,
          photoUrl: finalPhotoUrl,
        });
      }

      const fileContent = `import { AdminTeamMember } from '../../types/admin';\n\nexport const initialMockTeamMembers: AdminTeamMember[] = ${JSON.stringify(
        processedMembers,
        null,
        2
      )};\n`;

      const base64Code = utf8ToBase64(fileContent);
      const commitRes = await this.commitFile(
        'src/data/mock/mockTeam.ts',
        base64Code,
        `CMS: Update official team roster (${processedMembers.length} members, ${uploadedPhotos} photos uploaded)`
      );

      if (!commitRes.success) {
        return { success: false, deployedCount: 0, error: commitRes.error };
      }

      return { success: true, deployedCount: processedMembers.length, members: processedMembers };
    } catch (err: any) {
      return { success: false, deployedCount: 0, error: err?.message || 'Sync failed.' };
    }
  },

  // Full Partners Sync
  async syncFullPartnersToGithub(
    partners: AdminPartner[]
  ): Promise<{ success: boolean; deployedCount: number; partners?: AdminPartner[]; error?: string }> {
    const s = this.getSettings();
    if (!s.token) {
      return { success: false, deployedCount: 0, error: 'GitHub token not configured.' };
    }

    try {
      const processedPartners: AdminPartner[] = [];
      let uploadedLogos = 0;

      for (const p of partners) {
        let finalLogoUrl = p.logoUrl;

        if (finalLogoUrl && finalLogoUrl.startsWith('data:image/')) {
          const uploadRes = await this.uploadPartnerLogo(p.name, finalLogoUrl);
          if (uploadRes.success) {
            finalLogoUrl = uploadRes.logoUrl;
            uploadedLogos++;
          }
        }

        processedPartners.push({
          ...p,
          logoUrl: finalLogoUrl,
        });
      }

      const fileContent = `import { AdminPartner } from '../../types/admin';\n\nexport const initialMockPartners: AdminPartner[] = ${JSON.stringify(
        processedPartners,
        null,
        2
      )};\n`;

      const base64Code = utf8ToBase64(fileContent);
      const commitRes = await this.commitFile(
        'src/data/mock/mockPartners.ts',
        base64Code,
        `CMS: Update official partners roster (${processedPartners.length} partners, ${uploadedLogos} logos uploaded)`
      );

      if (!commitRes.success) {
        return { success: false, deployedCount: 0, error: commitRes.error };
      }

      return { success: true, deployedCount: processedPartners.length, partners: processedPartners };
    } catch (err: any) {
      return { success: false, deployedCount: 0, error: err?.message || 'Sync failed.' };
    }
  },

  // Full Events Sync (Supports up to 5 pictures per event)
  async syncFullEventsToGithub(
    events: AdminEvent[]
  ): Promise<{ success: boolean; deployedCount: number; events?: AdminEvent[]; error?: string }> {
    const s = this.getSettings();
    if (!s.token) {
      return { success: false, deployedCount: 0, error: 'GitHub token not configured.' };
    }

    try {
      const processedEvents: AdminEvent[] = [];
      let uploadedImages = 0;

      for (const e of events) {
        let finalCoverUrl = e.coverImageUrl;
        let finalImages: string[] = [];

        // Collect source images (either array or coverImageUrl)
        const sourceImages = Array.isArray(e.images) && e.images.length > 0
          ? e.images
          : (e.coverImageUrl ? [e.coverImageUrl] : []);

        // Process up to 5 pictures
        for (let i = 0; i < Math.min(5, sourceImages.length); i++) {
          let img = sourceImages[i];
          if (img && img.startsWith('data:image/')) {
            const uploadRes = await this.uploadEventImage(e.title, img, i);
            if (uploadRes.success) {
              img = uploadRes.url;
              uploadedImages++;
            }
          }
          finalImages.push(img);
        }

        if (finalImages.length > 0) {
          finalCoverUrl = finalImages[0];
        }

        processedEvents.push({
          ...e,
          coverImageUrl: finalCoverUrl,
          images: finalImages,
        });
      }

      const fileContent = `import { AdminEvent } from '../../types/admin';\n\nexport const initialMockEvents: AdminEvent[] = ${JSON.stringify(
        processedEvents,
        null,
        2
      )};\n`;

      const base64Code = utf8ToBase64(fileContent);
      const commitRes = await this.commitFile(
        'src/data/mock/mockEvents.ts',
        base64Code,
        `CMS: Update official events roster (${processedEvents.length} events, ${uploadedImages} photos uploaded)`
      );

      if (!commitRes.success) {
        return { success: false, deployedCount: 0, error: commitRes.error };
      }

      return { success: true, deployedCount: processedEvents.length, events: processedEvents };
    } catch (err: any) {
      return { success: false, deployedCount: 0, error: err?.message || 'Sync failed.' };
    }
  },
};
