// ─── Clinical Reference Ranges ───────────────────────────────────────────────
// Sources: Mayo Clinic, LabCorp, Quest Diagnostics standard adult ranges
// Gender-specific ranges use male defaults; female variants noted in comments

export interface ReferenceRange {
  min: number;
  max: number;
  unit: string;
  // Optional gender-specific overrides
  femaleMin?: number;
  femaleMax?: number;
}

export const CLINICAL_REFERENCE_RANGES: Record<string, ReferenceRange> = {
  // ── Complete Blood Count (CBC) ──────────────────────────────────────────
  'WBC': { min: 4.5, max: 11.0, unit: 'K/µL' },
  'White Blood Cell': { min: 4.5, max: 11.0, unit: 'K/µL' },
  'White Blood Count': { min: 4.5, max: 11.0, unit: 'K/µL' },

  'RBC': { min: 4.7, max: 6.1, unit: 'M/µL', femaleMin: 4.2, femaleMax: 5.4 },
  'Red Blood Cell': { min: 4.7, max: 6.1, unit: 'M/µL', femaleMin: 4.2, femaleMax: 5.4 },
  'Red Blood Count': { min: 4.7, max: 6.1, unit: 'M/µL', femaleMin: 4.2, femaleMax: 5.4 },

  'Hemoglobin': { min: 13.5, max: 17.5, unit: 'g/dL', femaleMin: 12.0, femaleMax: 15.5 },
  'Haemoglobin': { min: 13.5, max: 17.5, unit: 'g/dL', femaleMin: 12.0, femaleMax: 15.5 },

  'Hematocrit': { min: 41.0, max: 53.0, unit: '%', femaleMin: 36.0, femaleMax: 46.0 },
  'Haematocrit': { min: 41.0, max: 53.0, unit: '%', femaleMin: 36.0, femaleMax: 46.0 },
  'HCT': { min: 41.0, max: 53.0, unit: '%', femaleMin: 36.0, femaleMax: 46.0 },

  'Platelets': { min: 150, max: 400, unit: 'K/µL' },
  'Platelet Count': { min: 150, max: 400, unit: 'K/µL' },
  'PLT': { min: 150, max: 400, unit: 'K/µL' },

  'MCV': { min: 80, max: 100, unit: 'fL' },
  'MCH': { min: 27, max: 33, unit: 'pg' },
  'MCHC': { min: 32, max: 36, unit: 'g/dL' },
  'RDW': { min: 11.5, max: 14.5, unit: '%' },

  'Neutrophils': { min: 40, max: 70, unit: '%' },
  'Lymphocytes': { min: 20, max: 40, unit: '%' },
  'Monocytes': { min: 2, max: 10, unit: '%' },
  'Eosinophils': { min: 1, max: 6, unit: '%' },
  'Basophils': { min: 0, max: 1, unit: '%' },

  // ── Comprehensive Metabolic Panel (CMP) ──────────────────────────────────
  'Glucose': { min: 70, max: 99, unit: 'mg/dL' },
  'Fasting Glucose': { min: 70, max: 99, unit: 'mg/dL' },
  'Blood Glucose': { min: 70, max: 99, unit: 'mg/dL' },

  'Creatinine': { min: 0.74, max: 1.35, unit: 'mg/dL', femaleMin: 0.59, femaleMax: 1.04 },
  'Serum Creatinine': { min: 0.74, max: 1.35, unit: 'mg/dL', femaleMin: 0.59, femaleMax: 1.04 },

  'eGFR': { min: 60, max: 120, unit: 'mL/min/1.73m²' },
  'GFR': { min: 60, max: 120, unit: 'mL/min/1.73m²' },
  'Estimated GFR': { min: 60, max: 120, unit: 'mL/min/1.73m²' },
  'Glomerular Filtration Rate': { min: 60, max: 120, unit: 'mL/min/1.73m²' },

  'Sodium': { min: 136, max: 145, unit: 'mmol/L' },
  'Serum Sodium': { min: 136, max: 145, unit: 'mmol/L' },

  'Potassium': { min: 3.5, max: 5.1, unit: 'mmol/L' },
  'Serum Potassium': { min: 3.5, max: 5.1, unit: 'mmol/L' },

  'Chloride': { min: 98, max: 107, unit: 'mmol/L' },
  'CO2': { min: 23, max: 29, unit: 'mmol/L' },
  'Carbon Dioxide': { min: 23, max: 29, unit: 'mmol/L' },
  'Bicarbonate': { min: 22, max: 29, unit: 'mmol/L' },

  'BUN': { min: 7, max: 20, unit: 'mg/dL' },
  'Blood Urea Nitrogen': { min: 7, max: 20, unit: 'mg/dL' },
  'Urea': { min: 2.5, max: 7.1, unit: 'mmol/L' },

  'BUN/Creatinine Ratio': { min: 10, max: 20, unit: '' },

  'Calcium': { min: 8.5, max: 10.5, unit: 'mg/dL' },
  'Serum Calcium': { min: 8.5, max: 10.5, unit: 'mg/dL' },

  'Total Protein': { min: 6.3, max: 8.2, unit: 'g/dL' },
  'Albumin': { min: 3.5, max: 5.0, unit: 'g/dL' },
  'Globulin': { min: 2.0, max: 3.5, unit: 'g/dL' },

  'ALT': { min: 7, max: 56, unit: 'U/L' },
  'Alanine Aminotransferase': { min: 7, max: 56, unit: 'U/L' },
  'SGPT': { min: 7, max: 56, unit: 'U/L' },

  'AST': { min: 10, max: 40, unit: 'U/L' },
  'Aspartate Aminotransferase': { min: 10, max: 40, unit: 'U/L' },
  'SGOT': { min: 10, max: 40, unit: 'U/L' },

  'Alkaline Phosphatase': { min: 44, max: 147, unit: 'U/L' },
  'ALP': { min: 44, max: 147, unit: 'U/L' },

  'Bilirubin': { min: 0.1, max: 1.2, unit: 'mg/dL' },
  'Total Bilirubin': { min: 0.1, max: 1.2, unit: 'mg/dL' },
  'Direct Bilirubin': { min: 0.0, max: 0.3, unit: 'mg/dL' },

  // ── Lipid Panel ──────────────────────────────────────────────────────────
  'Total Cholesterol': { min: 0, max: 200, unit: 'mg/dL' },
  'Cholesterol': { min: 0, max: 200, unit: 'mg/dL' },
  'Cholesterol Total': { min: 0, max: 200, unit: 'mg/dL' },

  'HDL': { min: 40, max: 100, unit: 'mg/dL', femaleMin: 50, femaleMax: 100 },
  'HDL Cholesterol': { min: 40, max: 100, unit: 'mg/dL', femaleMin: 50, femaleMax: 100 },
  'HDL-C': { min: 40, max: 100, unit: 'mg/dL', femaleMin: 50, femaleMax: 100 },

  'LDL': { min: 0, max: 100, unit: 'mg/dL' },
  'LDL Cholesterol': { min: 0, max: 100, unit: 'mg/dL' },
  'LDL-C': { min: 0, max: 100, unit: 'mg/dL' },

  'Triglycerides': { min: 0, max: 150, unit: 'mg/dL' },
  'Triglyceride': { min: 0, max: 150, unit: 'mg/dL' },
  'VLDL': { min: 5, max: 40, unit: 'mg/dL' },

  'Non-HDL Cholesterol': { min: 0, max: 130, unit: 'mg/dL' },

  // ── Thyroid Panel ────────────────────────────────────────────────────────
  'TSH': { min: 0.4, max: 4.0, unit: 'mIU/L' },
  'Thyroid Stimulating Hormone': { min: 0.4, max: 4.0, unit: 'mIU/L' },

  'Free T4': { min: 0.8, max: 1.8, unit: 'ng/dL' },
  'FT4': { min: 0.8, max: 1.8, unit: 'ng/dL' },
  'Thyroxine Free': { min: 0.8, max: 1.8, unit: 'ng/dL' },

  'Free T3': { min: 2.3, max: 4.2, unit: 'pg/mL' },
  'FT3': { min: 2.3, max: 4.2, unit: 'pg/mL' },
  'Triiodothyronine Free': { min: 2.3, max: 4.2, unit: 'pg/mL' },

  'Total T4': { min: 5.0, max: 12.0, unit: 'µg/dL' },
  'T4': { min: 5.0, max: 12.0, unit: 'µg/dL' },
  'Total T3': { min: 80, max: 200, unit: 'ng/dL' },
  'T3': { min: 80, max: 200, unit: 'ng/dL' },

  // ── Hormones ─────────────────────────────────────────────────────────────
  'Testosterone Total': { min: 300, max: 1000, unit: 'ng/dL', femaleMin: 15, femaleMax: 70 },
  'Total Testosterone': { min: 300, max: 1000, unit: 'ng/dL', femaleMin: 15, femaleMax: 70 },
  'Testosterone': { min: 300, max: 1000, unit: 'ng/dL', femaleMin: 15, femaleMax: 70 },

  'Free Testosterone': { min: 9.0, max: 30.0, unit: 'ng/dL', femaleMin: 0.1, femaleMax: 0.85 },
  'Free T': { min: 9.0, max: 30.0, unit: 'ng/dL' },

  'DHEA-S': { min: 80, max: 560, unit: 'µg/dL', femaleMin: 35, femaleMax: 430 },
  'DHEA Sulfate': { min: 80, max: 560, unit: 'µg/dL', femaleMin: 35, femaleMax: 430 },

  'Cortisol': { min: 6, max: 23, unit: 'µg/dL' },
  'Morning Cortisol': { min: 6, max: 23, unit: 'µg/dL' },

  'Estradiol': { min: 10, max: 40, unit: 'pg/mL', femaleMin: 15, femaleMax: 350 },
  'E2': { min: 10, max: 40, unit: 'pg/mL', femaleMin: 15, femaleMax: 350 },

  'LH': { min: 1.5, max: 9.3, unit: 'mIU/mL' },
  'FSH': { min: 1.5, max: 12.4, unit: 'mIU/mL' },

  'Insulin': { min: 2, max: 25, unit: 'µIU/mL' },
  'Fasting Insulin': { min: 2, max: 25, unit: 'µIU/mL' },

  'IGF-1': { min: 115, max: 307, unit: 'ng/mL' },
  'Insulin-like Growth Factor': { min: 115, max: 307, unit: 'ng/mL' },

  'PSA': { min: 0, max: 4.0, unit: 'ng/mL' },
  'Prostate Specific Antigen': { min: 0, max: 4.0, unit: 'ng/mL' },

  // ── Vitamins & Minerals ──────────────────────────────────────────────────
  'Vitamin D': { min: 30, max: 100, unit: 'ng/mL' },
  'Vitamin D 25-OH': { min: 30, max: 100, unit: 'ng/mL' },
  '25-Hydroxy Vitamin D': { min: 30, max: 100, unit: 'ng/mL' },
  '25(OH)D': { min: 30, max: 100, unit: 'ng/mL' },
  '25-OH Vitamin D': { min: 30, max: 100, unit: 'ng/mL' },

  'Vitamin B12': { min: 200, max: 900, unit: 'pg/mL' },
  'B12': { min: 200, max: 900, unit: 'pg/mL' },
  'Cobalamin': { min: 200, max: 900, unit: 'pg/mL' },

  'Folate': { min: 5.9, max: 24.8, unit: 'ng/mL' },
  'Folic Acid': { min: 5.9, max: 24.8, unit: 'ng/mL' },
  'Vitamin B9': { min: 5.9, max: 24.8, unit: 'ng/mL' },

  'Iron': { min: 60, max: 170, unit: 'µg/dL', femaleMin: 50, femaleMax: 170 },
  'Serum Iron': { min: 60, max: 170, unit: 'µg/dL', femaleMin: 50, femaleMax: 170 },

  'Ferritin': { min: 30, max: 400, unit: 'ng/mL', femaleMin: 13, femaleMax: 150 },
  'Serum Ferritin': { min: 30, max: 400, unit: 'ng/mL', femaleMin: 13, femaleMax: 150 },

  'TIBC': { min: 250, max: 370, unit: 'µg/dL' },
  'Transferrin Saturation': { min: 20, max: 50, unit: '%' },

  'Magnesium': { min: 1.7, max: 2.2, unit: 'mg/dL' },
  'Serum Magnesium': { min: 1.7, max: 2.2, unit: 'mg/dL' },

  'Zinc': { min: 60, max: 130, unit: 'µg/dL' },
  'Selenium': { min: 70, max: 150, unit: 'µg/L' },

  'Phosphorus': { min: 2.5, max: 4.5, unit: 'mg/dL' },
  'Uric Acid': { min: 3.5, max: 7.2, unit: 'mg/dL', femaleMin: 2.6, femaleMax: 6.0 },

  'CRP': { min: 0, max: 1.0, unit: 'mg/L' },
  'hs-CRP': { min: 0, max: 1.0, unit: 'mg/L' },
  'C-Reactive Protein': { min: 0, max: 1.0, unit: 'mg/L' },

  'HbA1c': { min: 4.0, max: 5.6, unit: '%' },
  'Hemoglobin A1c': { min: 4.0, max: 5.6, unit: '%' },
  'A1c': { min: 4.0, max: 5.6, unit: '%' },

  'Homocysteine': { min: 4, max: 15, unit: 'µmol/L' },
};

/**
 * Look up clinical reference range for a biomarker by name.
 * Tries exact match first, then case-insensitive, then partial match.
 * Falls back to null if not found.
 */
export function getClinicalRange(
  name: string,
  gender?: string
): { min: number; max: number; unit: string } | null {
  const cleanName = name.trim();

  // 1. Exact match
  let ref = CLINICAL_REFERENCE_RANGES[cleanName];

  // 2. Case-insensitive exact match
  if (!ref) {
    const lower = cleanName.toLowerCase();
    const key = Object.keys(CLINICAL_REFERENCE_RANGES).find(k => k.toLowerCase() === lower);
    if (key) ref = CLINICAL_REFERENCE_RANGES[key];
  }

  // 3. Partial match — name contains a known key or vice versa
  if (!ref) {
    const lower = cleanName.toLowerCase();
    const key = Object.keys(CLINICAL_REFERENCE_RANGES).find(k => {
      const kl = k.toLowerCase();
      return lower.includes(kl) || kl.includes(lower);
    });
    if (key) ref = CLINICAL_REFERENCE_RANGES[key];
  }

  if (!ref) return null;

  const isFemale = gender?.toLowerCase().includes('f') || gender?.toLowerCase() === 'female';
  return {
    min: (isFemale && ref.femaleMin !== undefined) ? ref.femaleMin : ref.min,
    max: (isFemale && ref.femaleMax !== undefined) ? ref.femaleMax : ref.max,
    unit: ref.unit,
  };
}

/**
 * Merge API biomarker data with clinical reference ranges.
 * If the API returned min=0 and max=100 (default/wrong), override with clinical values.
 * Also corrects obviously wrong ranges (e.g. min===max, or min=0 max=100 pattern).
 */
export function resolveRange(
  name: string,
  apiMin: any,
  apiMax: any,
  apiValue: any,
  gender?: string
): { min: number; max: number } {
  const val = Number(apiValue) || 0;
  let min = Number(apiMin);
  let max = Number(apiMax);

  const isDefaultRange = (min === 0 && max === 100);
  const isDegenerate = (!min && !max) || min >= max || (min === 0 && max === 0);

  if (isDefaultRange || isDegenerate) {
    const clinical = getClinicalRange(name, gender);
    if (clinical) {
      return { min: clinical.min, max: clinical.max };
    }
    // Fallback: build range around the value
    const fallbackSpan = val > 0 ? val * 0.3 : 50;
    return {
      min: Math.max(0, val - fallbackSpan),
      max: val + fallbackSpan,
    };
  }

  return { min, max };
}