
// n8n API service layer for MarketingHub v2.0
const N8N_BASE_URL = process.env.REACT_APP_N8N_BASE_URL || 'http://localhost:5678';
const N8N_API_KEY = process.env.REACT_APP_N8N_API_KEY || '';

interface N8nResponse {
  success: boolean;
  data?: any;
  error?: string;
}

class N8nService {
  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<N8nResponse> {
    try {
      const response = await fetch(`${N8N_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'X-N8N-API-KEY': N8N_API_KEY,
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('N8n API error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Dashboard Analytics
  async getDashboardMetrics(): Promise<N8nResponse> {
    return this.makeRequest('/api/dashboard-metrics');
  }

  async getRecentActivities(): Promise<N8nResponse> {
    return this.makeRequest('/api/recent-activities');
  }

  async getCampaignPerformance(): Promise<N8nResponse> {
    return this.makeRequest('/api/campaign-performance');
  }

  // Weekly Plan Management
  async getWeeklyPlan(): Promise<N8nResponse> {
    return this.makeRequest('/api/weekly-plan');
  }

  async generateWeeklyPlan(): Promise<N8nResponse> {
    return this.triggerWorkflow('generate-weekly-plan', {});
  }

  async approveWeeklyPost(postId: number): Promise<N8nResponse> {
    return this.triggerWorkflow('approve-weekly-post', { postId });
  }

  // Publishing Queue
  async getQueuedPosts(): Promise<N8nResponse> {
    return this.makeRequest('/api/queued-posts');
  }

  async approvePost(postId: number): Promise<N8nResponse> {
    return this.triggerWorkflow('approve-post', { postId });
  }

  async reschedulePost(postId: number, newDateTime: string): Promise<N8nResponse> {
    return this.triggerWorkflow('reschedule-post', { postId, newDateTime });
  }

  async deletePost(postId: number): Promise<N8nResponse> {
    return this.triggerWorkflow('delete-post', { postId });
  }

  // Blog Management
  async getBlogPosts(): Promise<N8nResponse> {
    return this.makeRequest('/api/blog-posts');
  }

  async publishBlog(blogId: number): Promise<N8nResponse> {
    return this.triggerWorkflow('publish-blog', { blogId });
  }

  async regenerateBlog(blogId: number): Promise<N8nResponse> {
    return this.triggerWorkflow('regenerate-blog', { blogId });
  }

  async createBlogDraft(title: string, tags: string[]): Promise<N8nResponse> {
    return this.triggerWorkflow('create-blog-draft', { title, tags });
  }

  // Trends & References
  async getTrendingTopics(): Promise<N8nResponse> {
    return this.makeRequest('/api/trends');
  }

  async getCompetitorInsights(): Promise<N8nResponse> {
    return this.makeRequest('/api/competitor-insights');
  }

  async saveTrend(trendId: number): Promise<N8nResponse> {
    return this.triggerWorkflow('save-trend', { trendId });
  }

  async flagTrend(trendId: number, reason: string): Promise<N8nResponse> {
    return this.triggerWorkflow('flag-trend', { trendId, reason });
  }

  async refreshTrends(): Promise<N8nResponse> {
    return this.triggerWorkflow('refresh-trends', {});
  }

  // Newsletter Management
  async getNewsletters(): Promise<N8nResponse> {
    return this.makeRequest('/api/newsletters');
  }

  async sendNewsletter(newsletterId: number): Promise<N8nResponse> {
    return this.triggerWorkflow('send-newsletter', { newsletterId });
  }

  async scheduleNewsletter(newsletterId: number, sendDate: string): Promise<N8nResponse> {
    return this.triggerWorkflow('schedule-newsletter', { newsletterId, sendDate });
  }

  async createNewsletter(subject: string, template: string): Promise<N8nResponse> {
    return this.triggerWorkflow('create-newsletter', { subject, template });
  }

  // AI Chat Interface
  async sendChatMessage(message: string, context?: string): Promise<N8nResponse> {
    return this.triggerWorkflow('ai-chat', { message, context });
  }

  async getChatHistory(): Promise<N8nResponse> {
    return this.makeRequest('/api/chat-history');
  }

  // Workflow Management
  async getWorkflowStatus(): Promise<N8nResponse> {
    return this.makeRequest('/api/workflow-status');
  }

  async getActiveWorkflows(): Promise<N8nResponse> {
    return this.makeRequest('/api/active-workflows');
  }

  async triggerWorkflow(workflowName: string, data: any): Promise<N8nResponse> {
    return this.makeRequest(`/webhook/${workflowName}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Image Branding
  async generateBrandedImage(templateId: number, overlays: any[]): Promise<N8nResponse> {
    return this.triggerWorkflow('generate-branded-image', { templateId, overlays });
  }

  async getBrandTemplates(): Promise<N8nResponse> {
    return this.makeRequest('/api/brand-templates');
  }

  async uploadBrandAsset(file: File, type: string): Promise<N8nResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return this.makeRequest('/api/upload-brand-asset', {
      method: 'POST',
      body: formData,
      headers: {
        'X-N8N-API-KEY': N8N_API_KEY,
      },
    });
  }

  // Notifications & Settings
  async getNotifications(): Promise<N8nResponse> {
    return this.makeRequest('/api/notifications');
  }

  async markNotificationRead(notificationId: number): Promise<N8nResponse> {
    return this.makeRequest(`/api/notifications/${notificationId}/read`, {
      method: 'POST',
    });
  }
}

export const n8nService = new N8nService();
