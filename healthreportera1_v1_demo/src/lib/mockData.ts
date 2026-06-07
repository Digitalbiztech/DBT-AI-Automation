import { LabReport } from '@/types/lab';

export const MOCK_REPORT: LabReport = {
  patientName: 'John Doe',
  patientDob: '1980-05-15',
  labDate: '2026-03-01',
  labName: 'Quest Diagnostics',
  orderedBy: 'Dr. Sarah Mitchell, MD',
  summary:
    'Overall lab results show a mixed picture. Most values are within normal range, however LDL cholesterol and fasting glucose are mildly elevated, warranting dietary attention. Thyroid function is normal. Testosterone is within optimal range for age.',
  aiInsights: [
    'LDL cholesterol is mildly elevated. Consider reducing saturated fat intake and increasing physical activity.',
    'Fasting glucose is at the high end of normal — monitor trends and consider A1C testing.',
    'Vitamin D is slightly low. A supplement of 2000–4000 IU/day may be beneficial.',
    'All CBC values are within normal limits — no signs of anemia or infection.',
    'Thyroid panel (TSH, Free T3, Free T4) is optimal.',
  ],
  panels: [
    {
      name: 'Complete Blood Count (CBC)',
      biomarkers: [
        { name: 'WBC', value: 6.2, unit: 'K/uL', min: 4.0, max: 11.0, status: 'normal', category: 'CBC', description: 'White Blood Cells' },
        { name: 'RBC', value: 4.8, unit: 'M/uL', min: 4.2, max: 5.8, status: 'normal', category: 'CBC', description: 'Red Blood Cells' },
        { name: 'Hemoglobin', value: 14.5, unit: 'g/dL', min: 13.5, max: 17.5, status: 'normal', category: 'CBC', description: 'Hemoglobin' },
        { name: 'Hematocrit', value: 44, unit: '%', min: 38.8, max: 50.0, status: 'normal', category: 'CBC', description: 'Hematocrit' },
        { name: 'Platelets', value: 220, unit: 'K/uL', min: 150, max: 400, status: 'normal', category: 'CBC', description: 'Platelets' },
      ],
    },
    {
      name: 'Comprehensive Metabolic Panel (CMP)',
      biomarkers: [
        { name: 'Glucose', value: 102, unit: 'mg/dL', min: 70, max: 99, status: 'high', category: 'CMP', description: 'Fasting Glucose', insight: 'Mildly elevated. Monitor trends and discuss with your doctor.' },
        { name: 'BUN', value: 18, unit: 'mg/dL', min: 7, max: 25, status: 'normal', category: 'CMP', description: 'Blood Urea Nitrogen' },
        { name: 'Creatinine', value: 0.95, unit: 'mg/dL', min: 0.6, max: 1.2, status: 'normal', category: 'CMP', description: 'Creatinine' },
        { name: 'eGFR', value: 88, unit: 'mL/min', min: 60, max: 120, status: 'normal', category: 'CMP', description: 'Estimated GFR' },
        { name: 'Sodium', value: 140, unit: 'mEq/L', min: 136, max: 145, status: 'normal', category: 'CMP', description: 'Sodium' },
        { name: 'Potassium', value: 4.1, unit: 'mEq/L', min: 3.5, max: 5.1, status: 'normal', category: 'CMP', description: 'Potassium' },
        { name: 'ALT', value: 28, unit: 'U/L', min: 7, max: 40, status: 'normal', category: 'CMP', description: 'Alanine Aminotransferase (liver)' },
        { name: 'AST', value: 22, unit: 'U/L', min: 10, max: 40, status: 'normal', category: 'CMP', description: 'Aspartate Aminotransferase (liver)' },
      ],
    },
    {
      name: 'Lipid Panel',
      biomarkers: [
        { name: 'Total Cholesterol', value: 210, unit: 'mg/dL', min: 0, max: 199, status: 'high', category: 'Lipids', description: 'Total Cholesterol', insight: 'Borderline high. Diet and lifestyle changes can help.' },
        { name: 'LDL', value: 138, unit: 'mg/dL', min: 0, max: 99, status: 'high', category: 'Lipids', description: 'LDL (Bad) Cholesterol', insight: 'Elevated. Consider reducing saturated fat and refined carbs.' },
        { name: 'HDL', value: 52, unit: 'mg/dL', min: 40, max: 200, status: 'normal', category: 'Lipids', description: 'HDL (Good) Cholesterol' },
        { name: 'Triglycerides', value: 145, unit: 'mg/dL', min: 0, max: 149, status: 'normal', category: 'Lipids', description: 'Triglycerides' },
      ],
    },
    {
      name: 'Thyroid Panel',
      biomarkers: [
        { name: 'TSH', value: 1.8, unit: 'mIU/L', min: 0.4, max: 4.0, status: 'normal', category: 'Thyroid', description: 'Thyroid Stimulating Hormone' },
        { name: 'Free T4', value: 1.2, unit: 'ng/dL', min: 0.8, max: 1.8, status: 'normal', category: 'Thyroid', description: 'Free Thyroxine' },
        { name: 'Free T3', value: 3.1, unit: 'pg/mL', min: 2.3, max: 4.2, status: 'normal', category: 'Thyroid', description: 'Free Triiodothyronine' },
      ],
    },
    {
      name: 'Hormones',
      biomarkers: [
        { name: 'Testosterone Total', value: 520, unit: 'ng/dL', min: 300, max: 1000, status: 'normal', category: 'Hormones', description: 'Total Testosterone' },
        { name: 'Free Testosterone', value: 14.5, unit: 'pg/mL', min: 9.0, max: 30.0, status: 'normal', category: 'Hormones', description: 'Free Testosterone' },
        { name: 'DHEA-S', value: 285, unit: 'mcg/dL', min: 110, max: 510, status: 'normal', category: 'Hormones', description: 'DHEA Sulfate' },
        { name: 'Cortisol (AM)', value: 18, unit: 'mcg/dL', min: 6, max: 23, status: 'normal', category: 'Hormones', description: 'Morning Cortisol' },
      ],
    },
    {
      name: 'Vitamins & Minerals',
      biomarkers: [
        { name: 'Vitamin D', value: 28, unit: 'ng/mL', min: 30, max: 100, status: 'low', category: 'Vitamins', description: '25-OH Vitamin D', insight: 'Low. Consider 2000–4000 IU supplement daily.' },
        { name: 'Vitamin B12', value: 520, unit: 'pg/mL', min: 200, max: 900, status: 'normal', category: 'Vitamins', description: 'Cobalamin' },
        { name: 'Ferritin', value: 95, unit: 'ng/mL', min: 20, max: 250, status: 'normal', category: 'Vitamins', description: 'Iron Storage' },
        { name: 'Magnesium', value: 2.1, unit: 'mg/dL', min: 1.7, max: 2.4, status: 'normal', category: 'Vitamins', description: 'Serum Magnesium' },
      ],
    },
  ],
};
