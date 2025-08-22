import React, { SVGProps, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Sparkles, MessageSquare, Users, TrendingUp, Award, Newspaper, Edit2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface Template {
  id: string;
  name: string;
  description: string;
  content: string;
  icon: React.ComponentType<SVGProps<SVGSVGElement>> | string;
  color: string;
  isLoading?: boolean; // Optional loading state for individual templates
}

interface EditTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: Template | null;
  onSave: (id: string, content: string) => Promise<void>;
}

interface TemplatesProps {
  onTemplateSelect?: (template: { name: string }) => void;
  onMakePost?: (title: string, content: string) => void;
}

// Map internal template IDs to Supabase template names (must match exactly, including spaces)
const templateNameMapping: { [key: string]: string } = {
  'knowledge-educational': 'Educational',
  'promotional': 'Promotional',
  'discussion-engagement': 'Discussion & Engagement',
  'case-study-testimonial': 'Case Study & Testimonial',
  'industry-news': 'News', // No trailing space
  'personal': 'Personal'
};

const defaultTemplates: Template[] = [
  {
    id: 'knowledge-educational',
    name: 'Educational',
    description: 'Inform, educate, and provide value—establishing credibility.',
    content: JSON.stringify({
      name: 'Educational',
      description: 'Inform, educate, and provide value—establishing credibility.',
      content: '# Educational Post\n\n## Key Points\n- Share valuable insights\n- Educate your audience\n- Provide actionable takeaways\n\n## Call to Action\nWhat are your thoughts on this topic? Share in the comments!',
      tags: ['education', 'learning', 'knowledge']
    }),
    icon: FileText,
    color: 'bg-gradient-to-r from-blue-500 to-blue-600',
    isLoading: false,
  },
  {
    id: 'promotional',
    name: 'Promotional',
    description: 'Promote products/services framed around customer benefits.',
    content: JSON.stringify({
      name: 'Promotional',
      description: 'Promote products/services framed around customer benefits.',
      content: '# Promotional Post\n\n## Offer Details\n- Highlight key benefits\n- Include special offers\n- Add a clear call-to-action\n\n## Limited Time Offer\nAct now to take advantage of this exclusive deal!',
      tags: ['promotion', 'offer', 'sale']
    }),
    icon: Sparkles,
    color: 'bg-gradient-to-r from-purple-500 to-purple-600',
    isLoading: false,
  },
  {
    id: 'discussion-engagement',
    name: 'Discussion',
    description: 'Spark conversation and build community engagement.',
    content: JSON.stringify({
      name: 'Discussion',
      description: 'Spark conversation and build community engagement.',
      content: '# Discussion Starter\n\n## Topic\n[Insert thought-provoking question or topic]\n\n## Why It Matters\n- Share your perspective\n- Ask for opinions\n- Encourage discussion\n\n## Your Turn\nWhat are your thoughts? Let\'s discuss in the comments!',
      tags: ['discussion', 'engagement', 'community']
    }),
    icon: MessageSquare,
    color: 'bg-gradient-to-r from-orange-500 to-orange-600',
    isLoading: false,
  },
  {
    id: 'case-study-testimonial',
    name: 'Case Study & Testimonial',
    description: 'Build trust through client success and testimonials.',
    content: JSON.stringify({
      name: 'Case Study & Testimonial',
      description: 'Build trust through client success and testimonials.',
      content: '# Success Story\n\n## The Challenge\n[Briefly describe the challenge]\n\n## The Solution\n[Explain how you helped]\n\n## The Results\n- Key achievement 1\n- Key achievement 2\n- Key achievement 3\n\n## Client Quote\n"[Testimonial quote]"',
      tags: ['casestudy', 'testimonial', 'success']
    }),
    icon: Award,
    color: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
    isLoading: false,
  },
  {
    id: 'industry-news',
    name: 'News',
    description: 'Share relevant news and position as an industry expert.',
    content: JSON.stringify({
      name: 'News',
      description: 'Share relevant news and position as an industry expert.',
      content: '# Industry News Update\n\n## Breaking News\n[Summarize the news]\n\n## Why It Matters\n- Key point 1\n- Key point 2\n- Key point 3\n\n## My Take\n[Share your expert opinion]\n\n## Join the Conversation\nWhat are your thoughts on this development?',
      tags: ['news', 'industry', 'update']
    }),
    icon: Newspaper,
    color: 'bg-gradient-to-r from-teal-500 to-teal-600',
    isLoading: false,
  },
  {
    id: 'personal',
    name: 'Personal',
    description: 'Share personal stories, experiences, or insights to connect on a human level.',
    content: JSON.stringify({
      name: 'Personal',
      description: 'Share personal stories, experiences, or insights to connect on a human level.',
      content: '# Personal Reflection\n\n## The Experience\n[Share your personal story or experience]\n\n## What I Learned\n- Key takeaway 1\n- Key takeaway 2\n- Key takeaway 3\n\n## Food for Thought\nHow have similar experiences shaped you? I\'d love to hear your story in the comments.',
      tags: ['personal', 'story', 'experience']
    }),
    icon: Users,
    color: 'bg-gradient-to-r from-pink-400 to-pink-600',
  },
];

const EditTemplateDialog: React.FC<EditTemplateDialogProps> = ({
  open,
  onOpenChange,
  template: templateProp,
  onSave
}) => {
  // Local state for the dialog
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isValidJson, setIsValidJson] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Helper function to format and validate JSON
  const formatJson = (jsonString: string): { formatted: string; isValid: boolean } => {
    try {
      // First, try to parse as-is
      const parsed = JSON.parse(jsonString);
      return { formatted: JSON.stringify(parsed, null, 2), isValid: true };
    } catch (e) {
      console.warn('Initial JSON parse failed, trying to fix common issues:', e);
      try {
        // Common fix: Remove control characters and BOM
        let fixed = jsonString
          .replace(/[\u0000-\u001F\u007F-\u009F\u2028\u2029]/g, '')
          .replace(/^[\uFEFF\u200B]+/, '');
          
        // Try parsing the fixed string
        const parsed = JSON.parse(fixed);
        return { formatted: JSON.stringify(parsed, null, 2), isValid: true };
      } catch (e2) {
        console.error('Failed to fix JSON:', e2);
        return { formatted: jsonString, isValid: false };
      }
    }
  };

  // Update content when template prop changes or dialog opens
  useEffect(() => {
    if (open && templateProp) {
      console.log('[EditTemplateDialog] Initializing with template:', templateProp);
      try {
        // The content might already be a stringified JSON
        const contentStr = typeof templateProp.content === 'string' 
          ? templateProp.content 
          : JSON.stringify(templateProp.content);
          
        // Format and validate the JSON content
        const { formatted, isValid } = formatJson(contentStr);
        setContent(formatted);
        setIsValidJson(isValid);
        
        if (!isValid) {
          console.warn('[EditTemplateDialog] Content is not valid JSON, showing raw content');
        }
      } catch (e) {
        console.error('[EditTemplateDialog] Error processing template content:', e);
        setContent(
          typeof templateProp.content === 'string' 
            ? templateProp.content 
            : JSON.stringify(templateProp.content, null, 2)
        );
        setIsValidJson(false);
      }
      setIsLoading(false);
    } else {
      console.log('[EditTemplateDialog] No template provided');
      setContent('');
    }
  }, [open, templateProp]);

  // Debug log props
  console.log('[EditTemplateDialog] Props:', { open, templateProp });
  
  // Don't render if dialog is closed
  if (!open) {
    console.log('[EditTemplateDialog] Not rendering - dialog is closed');
    return null;
  }
  
  // If no template is provided but we're open, show a loading state
  if (!templateProp) {
    console.log('[EditTemplateDialog] No template provided but dialog is open - showing loading state');
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Loading Template...</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    // Validate JSON on the fly
    try {
      if (newContent.trim()) {
        JSON.parse(newContent);
        setIsValidJson(true);
      } else {
        setIsValidJson(false);
      }
    } catch (e) {
      setIsValidJson(false);
    }
  };

  const handleSave = async () => {
    if (!templateProp || !content.trim()) {
      console.warn('[handleSave] No template or empty content');
      toast.error('No template selected or empty content');
      return;
    }
    
    console.log(`[handleSave] Saving template: ${templateProp.id}`);
    console.log('[handleSave] Original content to save:', content);
    
    // Validate JSON before saving
    try {
      // First validate the JSON without modifying it
      JSON.parse(content);
      console.log('[handleSave] JSON is valid');
      
      // Set saving state
      setIsSaving(true);
      
      try {
        // Call the parent's onSave handler with the original content
        console.log('[handleSave] Calling onSave with template id and content');
        await onSave(templateProp.id, content);
        
        console.log('[handleSave] Save successful');
        toast.success('Template saved successfully');
        
        // Update the local content state with the saved content
        setContent(content);
        
        // Close the dialog after a short delay to show success message
        setTimeout(() => {
          console.log('[handleSave] Closing dialog after successful save');
          onOpenChange(false);
        }, 1000);
        
      } catch (error) {
        console.error('[handleSave] Error in onSave:', error);
        // Don't re-throw here, let the outer catch handle it
        throw error;
      }
      
    } catch (error) {
      console.error('[handleSave] Error saving template:', error);
      
      // Check if it's a JSON parse error
      if (error instanceof SyntaxError) {
        console.error('[handleSave] Invalid JSON format');
        toast.error('Invalid JSON format. Please check your template content.');
      } else {
        // Other errors
        console.error('[handleSave] Failed to save template:', error);
        toast.error('Failed to save template. Please try again.');
      }
      // Re-throw to be handled by the parent component
      throw error;
    } finally {
      console.log('[handleSave] Clearing saving state');
      setIsSaving(false);
    }
  };

  if (!templateProp) return null;

  const handleDialogOpenChange = (isOpen: boolean) => {
    console.log('[EditTemplateDialog] onOpenChange called with:', isOpen);
    if (!isOpen) {
      console.log('[EditTemplateDialog] Dialog is being closed, resetting state');
      // Reset the editing template when dialog is closed
      setEditingTemplate(null);
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Template: {templateProp.name}</DialogTitle>
          <DialogDescription>
            {templateProp.description}
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
            <span className="ml-2">Loading template content...</span>
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="relative">
              <Textarea
                value={content}
                onChange={handleContentChange}
                className={`min-h-[300px] font-mono text-sm ${!isValidJson ? 'border-red-500' : ''}`}
                placeholder="Enter template content here..."
                spellCheck="false"
              />
              {!isValidJson && (
                <div className="absolute bottom-2 right-2 text-xs text-red-500">
                  Invalid JSON format
                </div>
              )}
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            disabled={isSaving || isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving || !isValidJson || isLoading}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const Templates = ({ onTemplateSelect, onMakePost }: TemplatesProps) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Debug function to log all template names from the database
  const logAllTemplateNames = async () => {
    try {
      const { data: templates, error } = await supabase
        .from('template')
        .select('id, template_name, created_at, updated_at');
      
      if (error) {
        console.error('[logAllTemplateNames] Error fetching templates:', error);
        return;
      }
      
      console.log('[logAllTemplateNames] All templates in database:');
      templates?.forEach(t => {
        console.log(`- ID: ${t.id}, Name: '${t.template_name}'`);
      });
    } catch (err) {
      console.error('[logAllTemplateNames] Error:', err);
    }
  };

  // Function to fetch template content from Supabase
  const fetchTemplateContent = async (templateName: string): Promise<string | null> => {
    try {
      console.log(`[fetchTemplateContent] Fetching template content for: ${templateName}`);
      
      // Get the exact template name from Supabase
      const supabaseTemplateName = templateNameMapping[templateName];
      if (!supabaseTemplateName) {
        console.warn(`[fetchTemplateContent] No mapping found for template ID: ${templateName}`);
        return null;
      }
      
      // Log the exact name we're searching for
      console.log(`[fetchTemplateContent] Searching for exact name: '${supabaseTemplateName}'`);
      
      // First, try exact match with case sensitivity
      const { data: exactMatch } = await supabase
        .from('template')
        .select('*')
        .eq('template_name', supabaseTemplateName)
        .maybeSingle();
      
      if (exactMatch?.content) {
        console.log('[fetchTemplateContent] Found exact match:', exactMatch);
        return exactMatch.content;
      }
      
      // If no exact match, try case-insensitive search
      console.log(`[fetchTemplateContent] No exact match for '${supabaseTemplateName}', trying case-insensitive search`);
      
      const { data: allTemplates } = await supabase
        .from('template')
        .select('*');
        
      console.log('[fetchTemplateContent] All available templates:', allTemplates);
      
      // Find a matching template regardless of case or whitespace
      const normalizedTarget = supabaseTemplateName.trim().toLowerCase();
      const matchingTemplate = allTemplates?.find(t => 
        t.template_name?.trim().toLowerCase() === normalizedTarget
      );
      
      if (matchingTemplate?.content) {
        console.log(`[fetchTemplateContent] Found case-insensitive match:`, matchingTemplate);
        return matchingTemplate.content;
      }

      console.log(`[fetchTemplateContent] Using Supabase template name: ${supabaseTemplateName}`);
      
      // Fetch template by template_name
      console.log(`[fetchTemplateContent] Querying Supabase for template: '${supabaseTemplateName}'`);
      const { data: templateData, error: fetchError } = await supabase
        .from('template')
        .select('*')
        .eq('template_name', supabaseTemplateName.trim()) // Trim any whitespace
        .maybeSingle();
      
      if (fetchError) {
        console.error(`[fetchTemplateContent] Error fetching template '${supabaseTemplateName}':`, fetchError);
        return null;
      }

      if (!templateData) {
        // Try to list all templates to see what's available
        console.warn(`[fetchTemplateContent] Template not found: '${supabaseTemplateName}'`);
        const { data: allTemplates } = await supabase
          .from('template')
          .select('id, template_name, created_at');
        console.log('[fetchTemplateContent] Available templates in database:', allTemplates);
        return null;
      }

      console.log(`[fetchTemplateContent] Found template data:`, templateData);
      
      if (templateData.content) {
        const content = typeof templateData.content === 'string' 
          ? templateData.content 
          : JSON.stringify(templateData.content);
          
        // Log the raw content for debugging
        console.log(`[fetchTemplateContent] Raw content for '${supabaseTemplateName}':`, content);
        
        // Try to parse it to validate JSON
        try {
          JSON.parse(content);
          console.log(`[fetchTemplateContent] Content is valid JSON for '${supabaseTemplateName}'`);
        } catch (e) {
          console.error(`[fetchTemplateContent] Invalid JSON in '${supabaseTemplateName}':`, e);
        }
        
        return content;
      }

      console.warn(`[fetchTemplateContent] No content found for template: ${templateName}`);
      return null;
    } catch (error) {
      console.error(`[fetchTemplateContent] Error fetching template ${templateName}:`, error);
      return null;
    }
  };

  // Function to log all template names from Supabase for debugging
  const logTemplateNames = async () => {
    try {
      const { data: templates, error } = await supabase
        .from('template')
        .select('id, template_name, created_at');
      
      if (error) {
        console.error('Error fetching templates:', error);
        return;
      }
      
      console.log('Current templates in database:');
      templates?.forEach(t => console.log(`- ID: ${t.id}, Name: "${t.template_name}"`));
    } catch (error) {
      console.error('Error in logTemplateNames:', error);
    }
  };

  // Check Supabase client initialization
  // Initialize the template table with default data if empty
  const initializeTemplates = async () => {
    try {
      console.log('Initializing templates...');
      
      // First, try to get a list of all templates
      const { data: existingTemplates, error: fetchError } = await supabase
        .from('template')
        .select('id')
        .limit(1);
      
      // If we got an error, log it but continue
      if (fetchError) {
        console.error('Error checking existing templates:', fetchError);
      }
      
      // If no templates exist or we got an error, insert default ones
      if (fetchError || !existingTemplates || existingTemplates.length === 0) {
        console.log('No templates found or error occurred, ensuring default templates...');
        
        // Insert or update each default template
        for (const template of defaultTemplates) {
          console.log(`Ensuring template exists: ${template.id}`);
          
          // Prepare the template data for insertion
          const templateData = {
            id: template.id,
            template_name: template.id, // Use the ID as template_name for backward compatibility
            name: template.name,
            description: template.description,
            content: template.content,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          try {
            // First try to insert the template
            const { error: insertError } = await supabase
              .from('template')
              .insert(templateData);
            
            if (insertError) {
              // If insert fails (likely because it already exists), try to update
              const { error: updateError } = await supabase
                .from('template')
                .update(templateData)
                .eq('id', template.id);
              
              if (updateError) {
                console.error(`Error updating template ${template.id}:`, updateError);
              } else {
                console.log(`Successfully updated template: ${template.id}`);
              }
            } else {
              console.log(`Successfully inserted template: ${template.id}`);
            }
          } catch (error) {
            console.error(`Unexpected error with template ${template.id}:`, error);
          }
        }
      } else {
        console.log('Templates already exist in the database');
      }
      
    } catch (error) {
      console.error('Error initializing templates:', error);
    }
  };
  
  // Test function to verify Supabase connection and table structure
  const testSupabaseConnection = async () => {
    try {
      console.log('Testing Supabase connection...');
      
      // Test 1: Try a simple query to check connection
      const { data: testData, error: testError } = await supabase
        .from('template')
        .select('*')
        .limit(1);
      
      if (testError) {
        console.error('Error connecting to Supabase template table:', testError);
        
        // Try to create the table if it doesn't exist
        console.log('Attempting to create template table...');
        const { error: createError } = await supabase
          .from('template')
          .insert([{ 
            id: 'test-template', 
            content: '{}',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select();
          
        if (createError) {
          console.error('Error creating test template:', createError);
        } else {
          console.log('Successfully created test template');
        }
      } else {
        console.log('Successfully connected to Supabase template table');
      }
      
      // Initialize templates
      await initializeTemplates();
      
    } catch (error) {
      console.error('Supabase test failed:', error);
    }
  };

  // Function to load templates from the default list
  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      const defaultTemplates: Template[] = [
        { 
          id: 'knowledge-educational', 
          name: 'Knowledge & Educational', 
          description: 'Educational content and knowledge sharing', 
          icon: '📚',
          content: JSON.stringify({
            name: 'Knowledge & Educational',
            description: 'Educational content and knowledge sharing',
            sections: []
          }, null, 2),
          color: '#3b82f6' // blue
        },
        { 
          id: 'promotional', 
          name: 'Promotional', 
          description: 'Marketing and promotional content', 
          icon: '🎯',
          content: JSON.stringify({
            name: 'Promotional',
            description: 'Marketing and promotional content',
            sections: []
          }, null, 2),
          color: '#ef4444' // red
        },
        { 
          id: 'discussion-engagement', 
          name: 'Discussion & Engagement', 
          description: 'Content to spark discussions', 
          icon: '💬',
          content: JSON.stringify({
            name: 'Discussion & Engagement',
            description: 'Content to spark discussions',
            sections: []
          }, null, 2),
          color: '#10b981' // green
        },
        { 
          id: 'case-study-testimonial', 
          name: 'Case Study & Testimonial', 
          description: 'Showcase success stories', 
          icon: '📊',
          content: JSON.stringify({
            name: 'Case Study & Testimonial',
            description: 'Showcase success stories',
            sections: []
          }, null, 2),
          color: '#8b5cf6' // purple
        },
        { 
          id: 'industry-news', 
          name: 'Industry News', 
          description: 'Latest industry updates', 
          icon: '📰',
          content: JSON.stringify({
            name: 'Industry News',
            description: 'Latest industry updates',
            sections: []
          }, null, 2),
          color: '#f59e0b' // amber
        },
        { 
          id: 'personal', 
          name: 'Personal', 
          description: 'Personal thoughts and updates', 
          icon: '👤',
          content: JSON.stringify({
            name: 'Personal',
            description: 'Personal thoughts and updates',
            sections: []
          }, null, 2),
          color: '#ec4899' // pink
        },
      ];
      
      setTemplates(defaultTemplates);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    
    console.log('Supabase client initialized:', !!supabase);
    
    // Initialize component
    const init = async () => {
      await loadTemplates();
      await logTemplateNames();
    };
    
    init();
  }, []);

  useEffect(() => {
    const fetchTemplates = async () => {
      console.log('Starting to fetch templates...');
      try {
        // Start with default templates
        const templatesWithContent = [...defaultTemplates];
        
        // Fetch content for each template from Supabase
        const templatesWithContentPromises = templatesWithContent.map(async (template) => {
          try {
            const content = await fetchTemplateContent(template.id);
            return {
              ...template,
              content: content || JSON.stringify({
                name: template.name,
                description: template.description,
                // Default content structure
              }, null, 2)
            };
          } catch (error) {
            console.error(`Error processing template ${template.id}:`, error);
            return {
              ...template,
              content: JSON.stringify({
                name: template.name,
                description: template.description,
                // Default content structure
              }, null, 2)
            };
          }
        });

        const resolvedTemplates = await Promise.all(templatesWithContentPromises);
        console.log('Resolved templates:', resolvedTemplates);
        setTemplates(resolvedTemplates);
      } catch (error) {
        console.error('Error fetching templates:', error);
        toast.error('Failed to load templates');
        // Fallback to default templates
        setTemplates(defaultTemplates.map(t => ({
          ...t,
          content: JSON.stringify({
            name: t.name,
            description: t.description,
            // Add default content structure here
          }, null, 2)
        })));
      }
    };

    fetchTemplates();
  }, []);

  // Handle editing a template
  const handleEditTemplate = async (template: Template) => {
    try {
      console.log('[handleEditTemplate] Starting edit for template:', template.id);
      
      // Set the template as loading in the templates list
      setTemplates(prevTemplates => 
        prevTemplates.map(t => 
          t.id === template.id ? { ...t, isLoading: true } : t
        )
      );
      
      // Fetch the latest content from Supabase
      console.log(`[handleEditTemplate] Fetching content for template: ${template.id}`);
      let content = await fetchTemplateContent(template.id);
      
      // If no content was found in Supabase, use the default content from the template
      if (!content) {
        console.log('[handleEditTemplate] No content found in database, using default content');
        content = template.content;
      }
      
      let displayContent = content;
      
      // Try to parse and format the content if it's JSON
      try {
        const parsed = typeof content === 'string' ? JSON.parse(content) : content;
        // Convert to pretty-printed JSON for editing
        displayContent = JSON.stringify(parsed, null, 2);
        console.log('[handleEditTemplate] Successfully parsed and formatted JSON content');
      } catch (e) {
        // If it's not valid JSON, clean up any escaped newlines
        displayContent = content.replace(/\\n/g, '\n');
        console.log('[handleEditTemplate] Content is not valid JSON, using as-is');
      }
      
      // Create the updated template with the processed content
      const updatedTemplate = {
        ...template,
        content: displayContent,
        isLoading: false
      };
      
      console.log('[handleEditTemplate] Updated template with formatted content');
      
      // Set the editing template and open the dialog
      setEditingTemplate(updatedTemplate);
      setIsEditing(true);
      
      // Update the template in the list with the processed content
      setTemplates(prevTemplates =>
        prevTemplates.map(t =>
          t.id === template.id 
            ? { ...t, content: displayContent, isLoading: false } 
            : t
        )
      );
      
      return updatedTemplate;
    } catch (error) {
      console.error('Error preparing template for editing:', error);
      toast.error('Failed to load template for editing');
      
      // Reset loading state on error
      setTemplates(prevTemplates => 
        prevTemplates.map(t => 
          t.id === template.id ? { ...t, isLoading: false } : t
        )
      );
      throw error; // Re-throw to be caught by the caller
    }
  };

  const handleSaveTemplate = async (id: string, content: string): Promise<void> => {
    console.log(`[handleSaveTemplate] Starting to save template: ${id}`);
    
    // Get the template name from the mapping or use the ID as fallback
    const templateName = templateNameMapping[id] || id;
    console.log(`[handleSaveTemplate] Using template name: ${templateName}`);
    
    // Validate JSON content
    try {
      // Parse the content to validate it's valid JSON
      const parsedContent = JSON.parse(content);
      // Convert to string without extra formatting for storage
      content = JSON.stringify(parsedContent);
      console.log('[handleSaveTemplate] Validated JSON content');
    } catch (e) {
      console.warn('[handleSaveTemplate] Content is not valid JSON, but will try to save as-is');
      // Remove any escaped newlines if present
      content = content.replace(/\\n/g, '\n');
    }
    
    try {
      // First try to find if the template already exists
      const { data: existingTemplate, error: fetchError } = await supabase
        .from('template')
        .select('id, template_name')
        .eq('template_name', templateName)
        .maybeSingle();
      
      console.log('[handleSaveTemplate] Existing template check:', { existingTemplate, fetchError });
      
      let result;
      const now = new Date().toISOString();
      
      if (existingTemplate?.id) {
        // Update existing template
        console.log(`[handleSaveTemplate] Updating template with ID: ${existingTemplate.id}`);
        
        // Try with all possible fields first
        const updateData: any = { content };
        
        // Only include updated_at if the column exists
        try {
          updateData.updated_at = now;
        } catch (e) {
          console.log('[handleSaveTemplate] updated_at column might not exist, skipping');
        }
        
        const { data, error } = await supabase
          .from('template')
          .update(updateData)
          .eq('id', existingTemplate.id)
          .select()
          .single();
          
        if (error) {
          console.error('[handleSaveTemplate] Error updating template:', error);
          
          // If the error is about missing columns, try with just content
          if (error.message.includes('column')) {
            console.log('[handleSaveTemplate] Retrying update with only content');
            const { data: minimalData, error: minimalError } = await supabase
              .from('template')
              .update({ content })
              .eq('id', existingTemplate.id)
              .select()
              .single();
              
            if (minimalError) {
              console.error('[handleSaveTemplate] Error updating with minimal fields:', minimalError);
              throw minimalError;
            }
            
            result = minimalData;
          } else {
            throw error;
          }
        } else {
          result = data;
        }
      } else {
        // Insert new template with minimal required fields
        console.log('[handleSaveTemplate] Creating new template');
        
        const templateData: any = {
          template_name: templateName,
          content: content,
          created_at: now,
          updated_at: now
        };
        
        const { data, error } = await supabase
          .from('template')
          .insert([templateData])
          .select()
          .single();
          
        if (error) {
          console.error('[handleSaveTemplate] Error creating template:', error);
          // If the error is about missing columns, try with just the required fields
          if (error.message.includes('column')) {
            console.log('[handleSaveTemplate] Retrying with minimal fields');
            const minimalData = {
              template_name: templateName,
              content: content
            };
            
            const { data: minimalResult, error: minimalError } = await supabase
              .from('template')
              .insert([minimalData])
              .select()
              .single();
              
            if (minimalError) {
              console.error('[handleSaveTemplate] Error with minimal fields:', minimalError);
              throw minimalError;
            }
            
            result = minimalResult;
          } else {
            throw error;
          }
        } else {
          result = data;
        }
      }
      
      console.log('[handleSaveTemplate] Save successful:', result);
      
      // Create the updated template object with safe defaults
      const updatedTemplate = {
        id: id,
        name: result?.name || templateName,
        description: result?.description || `Template for ${templateName}`,
        content: content,
        icon: '📝', // Default icon
        color: '#3b82f6', // Default color
        updated_at: result?.updated_at || now
      };
      
      console.log('[handleSaveTemplate] Updated template object:', updatedTemplate);
      
      // Update the local state with the new content
      setTemplates(prevTemplates =>
        prevTemplates.map(template => {
          if (template.id === id) {
            // Only update the fields that exist in the template
            const updated = { ...template };
            if (content) updated.content = content;
            if (result?.name) updated.name = result.name;
            if (result?.description) updated.description = result.description;
            if (result?.updated_at) updated.updated_at = result.updated_at;
            
            // Ensure required fields have values
            if (!updated.name) updated.name = templateName;
            if (!updated.description) updated.description = `Template for ${templateName}`;
            if (!updated.updated_at) updated.updated_at = now;
            
            return updated;
          }
          return template;
        })
      );
      
      // Also update the editingTemplate if it's the one being edited
      setEditingTemplate(prev => {
        if (prev?.id === id) {
          const updated = { 
            ...prev,
            content: content,
            // Only update these fields if they exist in the result
            ...(result?.name && { name: result.name }),
            ...(result?.description && { description: result.description }),
            ...(result?.updated_at && { updated_at: result.updated_at })
          };
          
          // Ensure required fields have values
          if (!updated.name) updated.name = templateName;
          if (!updated.description) updated.description = `Template for ${templateName}`;
          if (!updated.updated_at) updated.updated_at = now;
          
          console.log('[handleSaveTemplate] Updated editingTemplate:', updated);
          return updated;
        }
        return prev;
      });
      
      return result;
    } catch (error) {
      console.error('[handleSaveTemplate] Error saving template:', error);
      throw error;
    }
  };
  // Function to render the icon - handles both component and emoji strings
  const renderIcon = (icon: React.ComponentType<SVGProps<SVGSVGElement>> | string) => {
    if (typeof icon === 'string') {
      // If it's a string (like an emoji), render it in a span
      return <span className="text-2xl">{icon}</span>;
    }
    // If it's a component, render it as before
    const IconComponent = icon;
    return <IconComponent className="h-6 w-6 text-white" />;
  };

  return (
    <div className="p-8">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">LinkedIn Post Templates</h2>
        <p className="text-gray-600">Choose a template to generate structured content for your LinkedIn posts</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {templates.map((template) => {
          return (
            <motion.div
              key={template.id}
              whileHover={{ scale: 1.04, y: -4 }}
              transition={{ duration: 0.2 }}
              className="group relative"
            >
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  console.log(`[EditButton] Edit button clicked for template: ${template.id}`);
                  
                  try {
                    await handleEditTemplate(template);
                    // setIsEditing(true) is already called in handleEditTemplate
                  } catch (error) {
                    console.error('[EditButton] Error loading template for editing:', error);
                    toast.error('Failed to load template for editing');
                  } finally {
                    // Reset loading state for this template
                    setTemplates(prev => 
                      prev.map(t => (t.id === template.id ? { ...t, isLoading: false } : t))
                    );
                  }
                }}
                className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
                title="Edit template"
                disabled={template.isLoading}
              >
                {template.isLoading ? (
                  <div className="h-4 w-4 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
                ) : (
                  <Edit2 className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                )}
              </button>
              <div className="cursor-pointer border-0 shadow-glass bg-card/80 backdrop-blur-md hover:shadow-2xl transition-all duration-200 p-0 rounded-2xl h-full">
                <CardContent className="flex flex-col items-center py-8 px-6 h-full">
                  <div className={`mb-4 rounded-full w-14 h-14 flex items-center justify-center shadow-lg ${template.color}`}>
                    {renderIcon(template.icon)}
                  </div>
                  <div className="text-center flex-grow">
                    <div className="text-lg font-bold text-text mb-1 font-sans">{template.name}</div>
                    <div className="text-sm text-text/70 mb-2 font-light font-sans">{template.description}</div>
                  </div>
                  <Button 
                    variant="default" 
                    className="mt-4 rounded-full bg-primary text-white px-6 py-2 shadow-lg group-hover:scale-105 transition-all" 
                    onClick={(e) => {
                      e.stopPropagation();
                      const message = `Make post using template: ${template.name}`;
                      if (onMakePost) {
                        onMakePost(message, '');
                      } else if (onTemplateSelect) {
                        onTemplateSelect({ name: template.name });
                      } else {
                        // Fallback to old behavior if no handlers are provided
                        const postData = {
                          type: 'template',
                          message: message
                        };
                        localStorage.setItem('makePostData', JSON.stringify(postData));
                        window.location.href = '/';
                      }
                    }}
                  >
                    Use Template
                  </Button>
                </CardContent>
              </div>
            </motion.div>
          );
        })}
      </div>

      <EditTemplateDialog
        open={isEditing}
        onOpenChange={setIsEditing}
        template={editingTemplate}
        onSave={handleSaveTemplate}
      />
    </div>
  );
};

export default Templates; 