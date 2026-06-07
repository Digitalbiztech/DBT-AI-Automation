import React from "react";
import { PremiumSidebar } from "@/components/premium/PremiumSidebar";
import { PremiumTopBar } from "@/components/premium/PremiumTopBar";
import { FileUpload } from "@/components/FileUpload";
import { useData } from "@/contexts/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, FileText, Trash2, ShieldCheck, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

export const DataWorkspace: React.FC = () => {
  const { 
    allRows, 
    uploadedFiles, 
    isProcessing, 
    handleFilesSelected, 
    handleArchiveDataLoaded,
    clearData 
  } = useData();

  return (
    <div className="bg-background text-on-background min-h-screen">
      <PremiumSidebar />
      <PremiumTopBar />
      
      <main className="ml-64 mt-16 p-8 min-h-screen">
        <header className="mb-10 animate-fade-in">
          <h1 className="text-4xl lg:text-5xl font-extrabold headline-font tracking-tight text-on-surface mb-2">
            Data Workspace
          </h1>
          <p className="text-on-surface-variant max-w-2xl font-light text-lg">
            Manage your real estate datasets, upload new CSV files, or explore historical archives.
          </p>
        </header>

        <div className="grid grid-cols-12 gap-8">
          {/* Left Column: Upload & Manage */}
          <div className="col-span-12 lg:col-span-12 space-y-8 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-muted/10 border-border/30 backdrop-blur-sm p-6 relative group">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-xl headline-font flex items-center gap-2">
                    <Database className="h-5 w-5 text-surface-tint" />
                    Ingestion Engine
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-sm text-on-surface-variant mb-6">
                    Drop your Zillow ZHVI or ZORI datasets here for instant processing.
                  </p>
                  <FileUpload 
                    onFilesSelected={handleFilesSelected}
                    onDataLoaded={handleArchiveDataLoaded}
                    isProcessing={isProcessing}
                    uploadedFiles={uploadedFiles}
                  />
                </CardContent>
                <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-xl">
                  <div className="absolute -right-8 -bottom-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                     <Database size={240} />
                  </div>
                </div>
              </Card>

              <Card className="bg-muted/10 border-border/30 backdrop-blur-sm p-6 overflow-hidden relative group">
                <CardHeader className="p-0 mb-4 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-xl headline-font flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-secondary" />
                    Loaded Context
                  </CardTitle>
                  {allRows.length > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearData}
                      className="text-error hover:text-error hover:bg-error/10 h-8 font-bold text-[10px] uppercase tracking-widest"
                    >
                      <Trash2 className="h-3 w-3 mr-1" /> Clear All
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="p-0">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-center bg-background/40 rounded-xl px-4 py-3 border border-outline-variant/10">
                         <span className="block text-2xl font-black text-on-surface headline-font">
                           {allRows.length.toLocaleString()}
                         </span>
                         <span className="text-[10px] uppercase tracking-tighter text-on-surface-variant font-bold">Total Datapoints</span>
                      </div>
                      <div className="text-center bg-background/40 rounded-xl px-4 py-3 border border-outline-variant/10">
                         <span className="block text-2xl font-black text-on-surface headline-font">
                           {uploadedFiles.length}
                         </span>
                         <span className="text-[10px] uppercase tracking-tighter text-on-surface-variant font-bold">Active Sources</span>
                      </div>
                    </div>

                    <div className="space-y-2 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                      {uploadedFiles.length > 0 ? (
                        uploadedFiles.map((file, i) => (
                          <div key={i} className="flex items-center gap-3 bg-surface-container-high/40 p-2.5 rounded-lg border border-outline-variant/5">
                            <FileText className="h-4 w-4 text-surface-tint" />
                            <span className="text-xs text-on-surface truncate flex-1">{file}</span>
                            <Badge variant="outline" className="text-[9px] uppercase font-bold py-0 h-4 bg-surface-tint/5 border-surface-tint/20 text-surface-tint">Verified</Badge>
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-on-surface-variant/40">
                           <Info className="h-8 w-8 mb-2 opacity-20" />
                           <p className="text-xs font-medium">No active data context</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DataWorkspace;
