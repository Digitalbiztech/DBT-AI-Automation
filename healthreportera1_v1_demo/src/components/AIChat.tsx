import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, ImagePlus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LabReport } from '@/types/lab';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { fetchPubMedAbstracts } from '@/lib/pubmed';
import iconLogo from '@/components/logo/YC_Icon_GS.png';

interface AIChatProps {
  reports: LabReport[];
}

type Message = { 
  id: string; 
  role: 'user' | 'assistant'; 
  content: string;
  image?: string; // Base64 or object URL
};

export function AIChat({ reports }: AIChatProps) {
  // Configured via VITE_API_URL for Render deployment
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      role: 'assistant', 
      content: 'Hello! I am your Personalized Medical Care chat agent. I can review your lab results, analyze trends, and even read medical flowcharts or guidelines if you upload them. How can I help you today?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedImageBase64, setSelectedImageBase64] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setSelectedImageBase64(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const constructSystemPrompt = () => {
    const latestReport = reports[reports.length - 1];
    if (!latestReport) return "You are an expert clinical laboratory interpretation AI.";

    let context = `
ROLE
You are an expert clinical laboratory interpretation assistant trained on medical literature, 
clinical guidelines, and laboratory medicine.

Your goal is to interpret laboratory reports like a physician writing a clinical commentary.

INPUT DATA
The user provides:
1. Structured biomarker data
2. Raw OCR lab report
3. Medical figures or guideline flowcharts when relevant

Use structured biomarkers as the primary data source.
Use OCR text and figures for additional clinical context.

PATIENT INFORMATION
Patient: ${latestReport.patientName || 'Unknown'}
Age: ${latestReport.patientAge || 'Unknown'}
Gender: ${latestReport.patientGender || 'Unknown'}
Date: ${latestReport.labDate || 'Unknown'}

CLINICAL INTERPRETATION PROCESS
For each biomarker:
1. Identify the biomarker and its physiological role
2. Compare the value against clinical reference ranges
3. Classify the result: Optimal, Normal, Borderline, Elevated / Reduced, or Clinically significant.
4. Provide interpretation including: Possible physiological causes, Associated disease risks, Relevant metabolic pathways, Whether intervention is required
5. When abnormal values appear, reference clinical guidelines.

BIOMARKER PANEL GROUPING
Group biomarkers into the following panels when present:
• Lipid Panel & Cardiovascular Risk
• Metabolic Panel
• Liver Function
• Kidney Function
• Thyroid Function
• Hormones
• Complete Blood Count
• Inflammatory Markers
• Nutritional Markers

FIGURE INTERPRETATION
If a clinical figure or flowchart is provided:
1. Identify the clinical topic of the figure.
2. Explain how the figure relates to abnormal biomarkers.
3. Summarize the diagnostic pathway shown in the figure.
4. Explain which step of the pathway might apply to this patient.

OUTPUT FORMAT (STRICT)
Return the analysis using the following structure, formatted with standard Markdown.
CRITICAL: You MUST use double newlines (\n\n) between every single paragraph, section, and list item. Do not output a dense block of text. Use bullet points heavily (*).
If a "### CLINICAL EVIDENCE (PUBMED)" block is provided below, you MUST weave that evidence into your "Areas for Optimization" section and cite the sources as [Ref 1], [Ref 2], etc.

GROUNDING & RESEARCH REQUIREMENTS:
1. You MUST first search for relevant clinical sources before answering.
2. Every claim you make MUST be grounded in a Google Search result.
3. For every clinical interpretation, the system will automatically inject [S1], [S2] citations.
4. If you cannot find a verifiable source for a claim, do not state it.

**Summary of Key Findings**: Summarize the most clinically relevant results.
**Areas for Optimization**: Discuss abnormal or borderline markers using provided evidence.
**Monitoring (Positive and Attention Needed)**: Clearly delineate what is going well (Positive) and what needs close tracking (Attention Needed).
**Clinical Diagnostic Flow**: Provide a step-by-step diagnostic flow.
**Recommendations**: Provide numbered actionable steps.
**References**: 
    *   Provide a numbered list of sources.
    *   For PubMed abstracts, you MUST use this exact format for the link to ensure it's blue and clickable: \`[PubMed: PMID] (URL)\`.
    *   Example: [1] *[Full Paper Title]* - [PubMed: 12345678](https://pubmed.ncbi.nlm.nih.gov/12345678/)
    *   All links must be blue, underlined, and clickable.

MEDICAL SAFETY
• Provide educational interpretation, not medical diagnosis.
• Encourage consultation with healthcare professionals.
• Highlight when urgent clinical follow-up may be required.

STRUCTURED BIOMARKERS:
`;

    latestReport.panels.forEach(p => {
       context += `\nPanel: ${p.name}\n`;
       p.biomarkers.forEach(b => {
          context += `- ${b.name}: ${b.value} ${b.unit} | Status: ${b.status} | Range: ${b.min}-${b.max}\n`;
       });
    });

    if (latestReport.rawApiResponse) {
       context += `\n\nRAW OCR / API DATAPOINTS:\n${JSON.stringify(latestReport.rawApiResponse, null, 2)}\n`;
    }

    return context;
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage)) return;
    
    let base64ImageStr = "";
    let mimeType = "";

    if (selectedImage && selectedImageBase64) {
      base64ImageStr = selectedImageBase64.split(',')[1];
      mimeType = selectedImage.type;
    }

    const userText = input.trim();
    const currentInput = input;
    const currentImage = selectedImageBase64;
    
    const userMsg: Message = { 
      id: Date.now().toString(), 
      role: 'user', 
      content: userText,
      image: currentImage || undefined
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    removeImage();
    setIsLoading(true);

    try {
      const history = messages.slice(1).map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userText,
          reports: reports,
          history: history
        }),
      });

      if (!response.ok) {
        throw new Error(`Chat failed with status: ${response.status}`);
      }

      const data = await response.json();
      const finalContent = data.response;

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: finalContent
      }]);

    } catch (error: any) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error communicating with AI: ${error.message || 'Unknown error'}. Please try again later.`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] min-h-[650px] bg-background border border-border/40 rounded-2xl shadow-sm overflow-hidden animate-fade-in">
      
      {/* Header */}
      <div className="bg-primary/5 border-b border-border/40 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl overflow-hidden border border-border/40 flex items-center justify-center shadow-sm">
            <img 
              src={iconLogo} 
              alt="YC" 
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-[11px] font-bold text-[#8a7a6a] uppercase tracking-widest leading-tight">Personalized Medical Care</h2>
            <p className="text-[10px] text-muted-foreground flex items-center gap-1.5 font-medium -mt-0.5">
              chat agent <span className="h-1 w-1 rounded-full bg-green-500 shadow-[0_0_4px_rgba(34,197,94,0.6)]"></span> Online
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* <input 
            type="password" 
            placeholder="AI API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="text-xs bg-background border border-border/60 rounded-lg px-3 py-1.5 w-48 focus:outline-none focus:ring-1 focus:ring-primary/50"
          /> */}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 bg-muted/5 custom-scrollbar">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={cn("flex gap-4 max-w-[85%]", msg.role === 'user' ? "self-end flex-row-reverse" : "self-start")}
          >
            <div className={cn(
              "h-8 w-8 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-sm overflow-hidden border border-border/20",
              msg.role === 'user' ? "bg-accent/20 text-accent" : "bg-[#D4BDAD]"
            )}>
              {msg.role === 'user' ? <User className="h-4 w-4" /> : <img src={iconLogo} alt="AI" className="h-full w-full object-cover" />}
            </div>
            <div className={cn(
              "px-5 py-3.5 rounded-2xl text-[13px] leading-relaxed shadow-sm overflow-hidden",
              msg.role === 'user' 
                ? "bg-[#D4BDAD] text-white rounded-tr-sm" 
                : "bg-card border border-border/60 text-foreground rounded-tl-sm ring-1 ring-black/5"
            )}>
              {msg.role === 'assistant' ? (
                <div className="prose prose-sm dark:prose-invert max-w-none text-sm break-words space-y-4
                             prose-p:leading-relaxed prose-p:my-3
                             prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-800 
                             prose-strong:font-semibold prose-strong:text-foreground/90
                             prose-ul:my-3 prose-ul:list-disc prose-ul:pl-5 prose-li:mb-2
                             prose-ol:my-3 prose-ol:list-decimal prose-ol:pl-5
                             prose-headings:mt-6 prose-headings:mb-3 prose-headings:font-bold
                             prose-h3:text-primary prose-h3:border-l-4 prose-h3:border-primary/30 prose-h3:pl-3
                             prose-blockquote:bg-blue-50 prose-blockquote:text-blue-900 prose-blockquote:px-4 prose-blockquote:py-3 prose-blockquote:rounded-lg prose-blockquote:border-none prose-blockquote:not-italic prose-blockquote:my-4 prose-blockquote:font-medium">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800" />
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <span>{msg.content}</span>
                  {msg.image && (
                    <img src={msg.image} alt="Upload" className="max-w-[200px] rounded-lg border border-primary-foreground/20 mt-2" />
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-4 max-w-[85%] self-start">
            <div className="h-8 w-8 rounded-full bg-[#D4BDAD] flex items-center justify-center shrink-0 mt-1 shadow-sm overflow-hidden border border-border/20">
              <img src={iconLogo} alt="AI" className="h-full w-full object-cover" />
            </div>
            <div className="px-5 py-4 rounded-2xl bg-background border border-border/40 text-foreground rounded-tl-sm flex items-center gap-3 shadow-sm">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground animate-pulse">Analyzing clinical data...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Image Preview Block */}
      {selectedImageBase64 && (
         <div className="mx-6 mt-2 relative inline-flex self-start border border-border/40 rounded-lg p-1 bg-background shadow-sm">
           <img src={selectedImageBase64} alt="Preview" className="h-16 w-auto rounded object-cover" />
           <button onClick={removeImage} className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-0.5 shadow-sm">
             <X className="h-3 w-3" />
           </button>
         </div>
      )}

      {/* Input Box */}
      <div className="p-4 bg-background border-t border-border/40 shrink-0">
        <div className="relative flex items-end gap-2 max-w-4xl mx-auto">
          
          <button 
             onClick={() => fileInputRef.current?.click()}
             className="h-[44px] w-[44px] shrink-0 flex items-center justify-center rounded-xl bg-secondary hover:bg-secondary/80 text-muted-foreground transition-colors border border-border/50"
             title="Upload Medical Flowchart or Image"
          >
            <ImagePlus className="h-5 w-5" />
          </button>
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            accept="image/*"
            onChange={handleImageSelect}
          />

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask AI to analyze your report or apply a medical flowchart..."
            className="w-full bg-secondary/30 border border-border/60 rounded-xl pl-4 pr-14 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none h-[44px] min-h-[44px] max-h-[120px] overflow-y-auto custom-scrollbar"
            rows={1}
          />

          <button 
            onClick={handleSend}
            disabled={(!input.trim() && !selectedImage) || isLoading}
            className="absolute right-2 bottom-1 h-[36px] w-[36px] flex items-center justify-center rounded-lg bg-[#8a7a6a] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#8a7a6a]/90 transition-all shadow-sm"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
