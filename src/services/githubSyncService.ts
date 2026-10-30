import { AdminTeamMember } from '../types/admin';

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

export function slugifyMemberName(name: string): string {
  const clean = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return clean || `member-${Date.now()}`;
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

  async uploadPhoto(
    memberName: string,
    dataUrlOrBase64: string
  ): Promise<{ success: boolean; photoUrl: string; error?: string }> {
    const slug = slugifyMemberName(memberName);
    const filename = `${slug}.jpg`;
    const repoPath = `public/assets/team/${filename}`;
    const publicUrl = `/assets/team/${filename}`;

    const rawBase64 = dataUrlOrBase64.replace(/^data:image\/[a-z]+;base64,/, '').trim();
    if (!rawBase64) {
      return { success: false, photoUrl: dataUrlOrBase64, error: 'Invalid base64 photo data' };
    }

    const res = await this.commitFile(
      repoPath,
      rawBase64,
      `CMS: Upload structured team photo for ${memberName}`
    );

    if (!res.success) {
      return { success: false, photoUrl: dataUrlOrBase64, error: res.error };
    }

    return { success: true, photoUrl: publicUrl };
  },

  async syncFullTeamToGithub(
    members: AdminTeamMember[]
  ): Promise<{ success: boolean; deployedCount: number; error?: string }> {
    const s = this.getSettings();
    if (!s.token) {
      return { success: false, deployedCount: 0, error: 'GitHub token not configured.' };
    }

    try {
      const processedMembers: AdminTeamMember[] = [];
      let uploadedPhotos = 0;

      // 1. Process and upload any base64 images to public/assets/team/
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

      // 2. Commit updated mockTeam.ts to GitHub
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

      return { success: true, deployedCount: processedMembers.length };
    } catch (err: any) {
      return { success: false, deployedCount: 0, error: err?.message || 'Sync failed.' };
    }
  },
};
