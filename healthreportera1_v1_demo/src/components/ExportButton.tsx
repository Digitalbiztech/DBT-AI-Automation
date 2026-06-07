import { useState } from 'react';
import { Download, Loader2, FileSpreadsheet, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LabReport } from '@/types/lab';
import logoUrl from '@/components/logo/YC_Main_WG.png';
import iconLogoUrl from '@/components/logo/YC_Icon_GS.png';

interface ExportButtonProps {
  report: LabReport;
}

export function ExportButton({ report }: ExportButtonProps) {
  const [exporting, setExporting] = useState(false);

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const { pdf } = await import('@react-pdf/renderer');
      const { PremiumPDFDocument } = await import('./PremiumPDFDocument');

      // Generate vector PDF dynamically in memory
      const blob = await pdf(
        <PremiumPDFDocument
          report={report}
          logoUrl={logoUrl}
          iconLogoUrl={iconLogoUrl}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `LabReport_${(report.patientName || 'Patient').replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF export error:', err);
      alert('PDF generation failed. Please run "npm install @react-pdf/renderer" in your terminal to complete the setup, then try again.');
    } finally {
      setExporting(false);
    }
  };

  const handleExportCSV = () => {
    setExporting(true);
    try {
      const rows = [
        ['Panel', 'Biomarker', 'Value', 'Unit', 'Ref Min', 'Ref Max', 'Status', 'Clinical Interpretation']
      ];
      report.panels.forEach(panel => {
        panel.biomarkers.forEach(b => {
          rows.push([
            panel.name,
            b.name,
            String(b.value ?? ''),
            b.unit ?? '',
            String(b.min ?? ''),
            String(b.max ?? ''),
            b.status,
            b.clinicalInterpretation || '',
          ]);
        });
      });
      const csv = rows.map(r => r.map(c => `"${(c || '').replace(/"/g, '""')}"`).join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href = url;
      a.setAttribute('download', `LabReport_${(report.patientName || 'Patient').replace(/\s+/g, '_')}_${report.labDate || 'report'}.csv`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('CSV export error:', err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          disabled={exporting}
          variant="outline"
          className="gap-2 border-primary/30 text-primary hover:bg-primary/5 hover:text-primary glow-primary transition-all duration-300"
        >
          {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          {exporting ? 'Generating PDF…' : 'Export'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportPDF} className="gap-2 cursor-pointer">
          <Download className="h-4 w-4" /> Save PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportCSV} className="gap-2 cursor-pointer">
          <FileSpreadsheet className="h-4 w-4" /> Export as CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

