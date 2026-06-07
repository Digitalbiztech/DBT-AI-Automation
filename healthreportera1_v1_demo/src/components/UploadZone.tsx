import React, { useCallback, useState } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface UploadZoneProps {
  onFile: (file: File) => void;
  loading: boolean;
}

export function UploadZone({ onFile, loading }: UploadZoneProps) {
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState('');

  const validate = (file: File) => {
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file.');
      return false;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError('File must be under 20MB.');
      return false;
    }
    setError('');
    return true;
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDrag(false);
      const file = e.dataTransfer.files[0];
      if (file && validate(file)) onFile(file);
    },
    [onFile],
  );

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validate(file)) onFile(file);
  };

  return (
    <div className="w-full">
      <label
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        className={cn(
          'flex flex-col items-center justify-center w-full min-h-[200px] rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200',
          drag
            ? 'border-[#D4BDAD] bg-[#D4BDAD]/10'
            : 'border-border bg-transparent hover:bg-[#D4BDAD]/5 hover:border-[#D4BDAD]',
          loading && 'pointer-events-none opacity-60',
        )}
      >
        <input
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleInput}
          disabled={loading}
        />
        <div className="flex flex-col items-center gap-3 px-8 py-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#D4BDAD]/20 shadow-sm border border-[#D4BDAD]/10">
            <Upload className="h-6 w-6 text-[#8a7a6a]" />
          </div>
          <div>
            <p className="font-semibold text-foreground">
              {loading ? 'Analyzing lab results…' : 'Drop lab PDF here'}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {loading ? 'Our AI is extracting and interpreting your biomarkers' : 'or click to browse — PDF only, max 20MB'}
            </p>
          </div>
          {!loading && (
              <Button size="sm" className="mt-1 pointer-events-none bg-[#8a7a6a] text-white hover:bg-[#8a7a6a]/90 shadow-sm">
                <FileText className="h-4 w-4" />
                Select PDF
              </Button>
          )}
          {loading && (
            <div className="flex gap-1 mt-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-2 w-2 rounded-full bg-[#D4BDAD] animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          )}
        </div>
      </label>
      {error && (
        <div className="mt-2 flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  );
}
