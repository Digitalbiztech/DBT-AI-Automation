export interface Agent {
  id: string;
  name: string;
  webhookUrl: string;
  icon: string;
  password?: string; // Optional password for agent access
}

export const AGENTS: Agent[] = [
  {
    id: 'travel',
    name: 'Travel AI',
    webhookUrl: '',
    icon: '✈️',
    password: 'travel123'
  },
  {
    id: 'alt',
    name: 'Alt Agent',
    webhookUrl: 'https://nosta.app.n8n.cloud/webhook/294801bb-565e-4d46-a75d-5c4b0f26a18b',
    icon: '🔄',
    password: 'alt123'
  },
  {
    id: 'sap',
    name: 'SAP Agent',
    webhookUrl: 'https://n8n.digitalbiz.tech/webhook/03c4b591-d635-40ec-82b6-ffa42edda35f',
    icon: '🔷',
    password: 'sap123' // Example password
  },
  {
    id: 'legal',
    name: 'Legal',
    webhookUrl: 'https://nosta.app.n8n.cloud/webhook/8b72a299-6557-4d8c-a365-09e105d76393',
    icon: '⚖️',
    password: 'legal123' // Example password
  },
  {
    id: 'website',
    name: 'Website',
    webhookUrl: 'https://n8n.digitalbiz.tech/webhook/488406a9-e2ec-406b-9616-bd648f801d7a',
    icon: '🌐',
    password: 'web123' // Example password
  },
  {
    id: 'cost',
    name: 'Cost Cal',
    webhookUrl: 'https://nosta.app.n8n.cloud/webhook/b4c843be-698d-40c6-8e31-9370f5e165e0',
    icon: '💰',
    password: 'cost123' // Example password
  },
];


