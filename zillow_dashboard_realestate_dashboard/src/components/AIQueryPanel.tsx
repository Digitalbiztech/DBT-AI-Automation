import { useState, useMemo, useEffect } from "react";
import { Sparkles, Send, Loader2, AlertCircle, TrendingUp, DollarSign, BarChart3, ShieldAlert, MapPin, FileText, History, Target, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { analyzeWithMistral, executeAnalysis, generateDataSummary, type AnalysisResult, type AnalysisType, type AnalysisMessage } from "@/lib/queryEngine";
import { getApiKey, getUseLargeModel } from "@/components/SettingsModal";
import { QueryResults } from "@/components/QueryResults";
import type { RealEstateRow } from "@/lib/dataProcessing";

interface Template {
  id: string;
  label: string;
  query: string;
  icon: React.ReactNode;
  category: AnalysisType;
  description: string;
}

const TEMPLATES: Template[] = [
  {
    id: "overview",
    label: "Market Overview",
    query: "Give me a comprehensive market overview showing average home values by state with growth rates",
    icon: <BarChart3 className="h-4 w-4" />,
    category: "overview",
    description: "Summary of all markets",
  },
  {
    id: "investment",
    label: "Investment Opportunities",
    query: "Which markets have the best rental yield and ROI for real estate investment? Show top 10",
    icon: <DollarSign className="h-4 w-4" />,
    category: "investment",
    description: "Find best ROI markets",
  },
  {
    id: "trends",
    label: "Market Trends",
    query: "Show me the housing market trends with YoY growth and CAGR for each state",
    icon: <TrendingUp className="h-4 w-4" />,
    category: "time_series",
    description: "Price trends over time",
  },
  {
    id: "risk",
    label: "Risk Analysis",
    query: "Which markets have highest volatility and risk? Show me the risk metrics",
    icon: <ShieldAlert className="h-4 w-4" />,
    category: "risk",
    description: "Identify high-risk markets",
  },
  {
    id: "compare",
    label: "Compare Markets",
    query: "Compare the real estate markets in Texas, Florida, and California",
    icon: <MapPin className="h-4 w-4" />,
    category: "comparative",
    description: "Side-by-side comparison",
  },
];

interface AIQueryPanelProps {
  data: RealEstateRow[];
}

export function AIQueryPanel({ data }: AIQueryPanelProps) {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
  const [history, setHistory] = useState<AnalysisMessage[]>([]);
  const [reasoningSteps, setReasoningSteps] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [suggestedFollowUps, setSuggestedFollowUps] = useState<string[]>([]);

  // Simulation of reasoning steps
  useEffect(() => {
    if (isLoading && reasoningSteps.length > 0) {
      const interval = setInterval(() => {
        setCurrentStep((prev) => (prev < reasoningSteps.length - 1 ? prev + 1 : prev));
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [isLoading, reasoningSteps]);

  const dataSummary = useMemo(() => {
    if (!data.length) return undefined;
    return generateDataSummary(data);
  }, [data]);

  const handleSubmit = async (overrideQuery?: string) => {
    const finalQuery = overrideQuery || query;
    if (!finalQuery.trim() && !activeTemplate) return;

    if (!data.length) {
      setError("Please load some data first before querying.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);
    setReasoningSteps(["Accessing real estate dataset", "Initializing neural mapping", "Filtering regional parameters"]);
    setCurrentStep(0);

    try {
      const apiKey = getApiKey();
      const useLarge = getUseLargeModel();
      const activeQ = activeTemplate 
        ? TEMPLATES.find(t => t.id === activeTemplate)?.query || finalQuery 
        : finalQuery;
      
      const { operation, reasoningSteps: aiSteps, suggestedFollowUps: followUps } = 
        await analyzeWithMistral(activeQ, apiKey, dataSummary, useLarge, history);
      
      setReasoningSteps(aiSteps);
      setSuggestedFollowUps(followUps);
      
      const analysisResult = executeAnalysis(data, operation);
      setResult(analysisResult);
      
      // Update history
      setHistory(prev => [
        ...prev, 
        { role: "user" as const, content: activeQ },
        { role: "assistant" as const, content: analysisResult.insights[0] || "Analysis completed." }
      ].slice(-10)); // Keep last 10 messages
      
    } catch (err) {
      console.error("[AIQuery] Error:", err);
      setError(err instanceof Error ? err.message : "Failed to process query");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemplateClick = (template: Template) => {
    setQuery(template.query);
    setActiveTemplate(template.id);
    setResult(null);
    setError(null);
  };

  const hasData = data.length > 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">AI Real Estate Analyst</h2>
        </div>
        {result && (
          <Badge variant="outline" className="bg-primary/10 text-primary">
            {result.operation.analysisType}
          </Badge>
        )}
      </div>

      {/* Templates */}
      <Card className="bg-muted/30 border-border/30 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Analysis Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {TEMPLATES.map((template) => (
              <Button
                key={template.id}
                variant={activeTemplate === template.id ? "default" : "outline"}
                size="sm"
                className="h-auto py-2 px-3 flex flex-col items-start gap-1"
                onClick={() => handleTemplateClick(template)}
                disabled={!hasData}
              >
                <span className="flex items-center gap-1.5">
                  {template.icon}
                  <span className="text-xs font-medium">{template.label}</span>
                </span>
                <span className="text-[10px] text-muted-foreground/70">
                  {template.description}
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Query Input */}
      <Card className="bg-muted/30 border-border/30 backdrop-blur-sm">
        <CardContent className="pt-4">
          <div className="flex gap-2">
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveTemplate(null);
              }}
              placeholder="Ask anything about real estate markets... e.g., 'Is it a good time to buy in Florida?'"
              className="bg-background/50 border-border/50 text-sm"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              disabled={!hasData}
            />
            <Button
              onClick={() => handleSubmit()}
              disabled={!hasData || (!query.trim() && !activeTemplate) || isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Analyze
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading & Reasoning State */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <Card className="bg-primary/5 border-primary/20 backdrop-blur-md overflow-hidden relative">
              <motion.div 
                className="absolute top-0 left-0 h-1 bg-primary"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 5, ease: "easeInOut" }}
              />
              <CardContent className="pt-6 pb-6">
                <div className="flex flex-col items-center justify-center gap-4 py-4">
                  <div className="relative">
                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                    <Sparkles className="h-4 w-4 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                  </div>
                  <div className="space-y-2 text-center">
                    <h3 className="text-lg font-medium text-primary">Insight AI is thinking...</h3>
                    <div className="flex flex-col gap-1">
                      {reasoningSteps.map((step, idx) => (
                        <motion.p
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ 
                            opacity: idx <= currentStep ? 1 : 0.3,
                            x: 0,
                            scale: idx === currentStep ? 1.05 : 1
                          }}
                          className={`text-sm ${idx === currentStep ? "text-primary font-medium" : "text-muted-foreground"}`}
                        >
                          {idx < currentStep ? "✓ " : idx === currentStep ? "→ " : "• "}{step}
                        </motion.p>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            {/* Key Insights */}
            {result.insights.length > 0 && (
              <Card className="bg-gradient-to-br from-primary/10 via-background to-background border-primary/30 shadow-lg shadow-primary/5 overflow-hidden">
                <CardHeader className="pb-2 border-b border-primary/10 bg-primary/5">
                  <CardTitle className="text-sm font-semibold text-primary flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Strategic Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-3">
                    {result.insights.map((insight, idx) => (
                      <motion.li 
                        key={idx} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="text-sm text-foreground flex items-start gap-3 p-2 rounded-lg hover:bg-primary/5 transition-colors"
                      >
                        <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="leading-relaxed">{insight}</span>
                      </motion.li>
                    ))}
                  </ul>

                  {result.recommendations && result.recommendations.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-primary/10">
                      <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Recommendations</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {result.recommendations.map((rec, idx) => (
                          <div key={idx} className="text-xs text-foreground/90 bg-muted/50 p-2 rounded border border-border/50 flex items-center gap-2 shadow-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            {rec}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Follow-up Questions */}
                  {suggestedFollowUps.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-primary/10">
                      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
                        <History className="h-3 w-3" />
                        Next Steps
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {suggestedFollowUps.slice(0, 3).map((q, idx) => (
                          <Button
                            key={idx}
                            variant="outline"
                            size="sm"
                            className="text-[11px] h-auto py-1.5 px-3 bg-background/50 hover:bg-primary/5 hover:text-primary hover:border-primary/30 group transition-all"
                            onClick={() => {
                              setQuery(q);
                              handleSubmit(q);
                            }}
                          >
                            {q}
                            <ArrowRight className="ml-1.5 h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Metrics Summary */}
            {result.metrics && (
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Analyzed Units", value: result.metrics.totalRecords, icon: <FileText className="h-4 w-4" /> },
                  { label: "Market Value", value: `$${(result.metrics.avgPrice || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`, icon: <DollarSign className="h-4 w-4" /> },
                  { label: "Avg Rental", value: `$${(result.metrics.avgRent || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo`, icon: <TrendingUp className="h-4 w-4" /> }
                ].map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                  >
                    <Card className="bg-muted/40 border-border/50 backdrop-blur-sm group hover:border-primary/30 transition-colors">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-primary group-hover:scale-110 transition-transform">{m.icon}</span>
                          <p className="text-[10px] font-medium text-muted-foreground uppercase">{m.label}</p>
                        </div>
                        <p className="text-base font-bold text-foreground truncate">{m.value}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Query Results with Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <QueryResults 
                result={{
                  data: result.data,
                  operation: result.operation as any,
                  explanation: result.insights[0] || `Analysis of ${result.operation.analysisType}`,
                  chartType: result.chartType as any,
                  columns: result.data.length > 0 ? Object.keys(result.data[0]) : [],
                }} 
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Data Status */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <div className={`w-2 h-2 rounded-full ${hasData ? "bg-green-500" : "bg-gray-300"}`} />
        <span>
          {hasData 
            ? `${data.length.toLocaleString()} records loaded - ready for analysis`
            : "No data loaded - load archive data to begin"}
        </span>
      </div>
    </div>
  );
}