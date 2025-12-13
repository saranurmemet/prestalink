'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import UserLayout from '@/components/layout/UserLayout';
import ProtectedPage from '@/components/layout/ProtectedPage';
import { Download, FileText } from 'lucide-react';

const CVPage = () => {
  const { user } = useAuthStore();
  const [cvContent, setCvContent] = useState('');

  useEffect(() => {
    // Demo CV content
    const demoCV = `MEHMET DEMIR - EUROPASS CV
================================================================================

PERSONAL INFORMATION
Full Name:          Mehmet Demir
Date of Birth:      March 15, 1995 (Age: 30)
Nationality:        Algerian
Phone:              +213 555 123 456
Email:              mehmet@prestalink.app
Languages:          Turkish (Native), French (C1), English (B2), Arabic (Native)

================================================================================

PROFESSIONAL SUMMARY
────────────────────────────────────────────────────────────────────────────
Highly skilled CNC Machinist and Technical Operator with 6+ years of 
progressive experience in precision manufacturing and automotive component 
production. Proven expertise in operating advanced CNC machinery, CAD/CAM 
software, and implementing quality control procedures in high-volume 
production environments.

Successfully managed production schedules, trained junior operators, and 
consistently achieved 99.8% quality compliance rates. Seeking challenging 
opportunities in European automotive and manufacturing sectors.

================================================================================

WORK EXPERIENCE
────────────────────────────────────────────────────────────────────────────

Senior CNC Operator & Team Lead
Automotive Components Algeria (ACA) | Algiers, Algeria
January 2021 - Present (4 years)

• Lead a team of 6 CNC operators in producing high-precision automotive 
  components for European export markets (BMW, Mercedes-Benz suppliers)
• Program and operate Siemens 840D and Fanuc CNC machines
• Reduced production defects by 35% through enhanced quality control
• Maintain 99.8% on-time delivery rate
• Collaborate with German and French engineering teams
• Employee of the Year 2023

────────────────────────────────────────────────────────────────────────────

CNC Machinist
MetalWorks Manufacturing | Algiers, Algeria  
June 2018 - December 2020 (2.5 years)

• Operated 3-axis and 4-axis CNC milling machines
• Produced components with tolerances of ±0.01mm
• Performed first-article inspections and SPC
• Trained 4 junior machinists
• 25% reduction in material waste

================================================================================

EDUCATION
────────────────────────────────────────────────────────────────────────────

Technical Diploma in Mechanical Engineering
Algiers Technical Institute of Industrial Technology
September 2013 - June 2017

Specialization: CNC Manufacturing & Computer-Aided Design
GPA: 16.2/20 (Distinction)

================================================================================

CERTIFICATIONS
────────────────────────────────────────────────────────────────────────────

✓ Advanced CNC Programming - Siemens 840D (2021)
✓ ISO 9001:2015 Quality Management Systems (Valid until 2025)
✓ Occupational Health & Safety Certificate (Valid until 2026)
✓ AutoCAD Professional Certification (2020)
✓ French Language Proficiency - DELF B2 (2019)
✓ Lean Manufacturing & Six Sigma Yellow Belt (2023)
✓ First Aid & Emergency Response Training (2022)
✓ Advanced Metrology & CMM Operation (2021)

================================================================================

TECHNICAL SKILLS
────────────────────────────────────────────────────────────────────────────

CNC Operations:        Siemens 840D, Fanuc, 3-5 Axis Machining
CAD/CAM Software:      AutoCAD, Mastercam, SolidWorks, Fusion 360
Quality & Metrology:   CMM, SPC, GD&T, First Article Inspection
Materials:             Steel, Aluminum, Titanium, Engineering Plastics
Soft Skills:           Team Leadership, Training, Problem Solving

================================================================================

LANGUAGE PROFICIENCY
────────────────────────────────────────────────────────────────────────────

Turkish      ████████████████████ Native (C2)
French       ██████████████████░░ Advanced (C1) - DELF B2 Certified
English      ████████████░░░░░░░░ Upper-Intermediate (B2)
Arabic       ████████████████████ Native (C2)
German       ████░░░░░░░░░░░░░░░░ Elementary (A2) - Currently Learning

================================================================================

PROJECTS & ACHIEVEMENTS
────────────────────────────────────────────────────────────────────────────

🏆 Employee of the Year 2023
🏆 Zero Defect Production Award (2022) - 6 consecutive months
📊 Process Improvement Initiative (2023) - 40% setup time reduction
🌍 International Collaboration Project with German engineering team
💡 Innovation Award (2020) - Custom fixture design

================================================================================

ADDITIONAL INFORMATION
────────────────────────────────────────────────────────────────────────────

Relocation:         Fully prepared to relocate to Europe
Driving License:    Category B (European equivalent)
Availability:       Can start within 30 days
Expected Salary:    €2,800 - €3,800 gross/month

================================================================================

CV Last Updated: December 13, 2025`;

    setCvContent(demoCV);
  }, []);

  const handleDownload = () => {
    const blob = new Blob([cvContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Mehmet_Demir_CV.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <ProtectedPage allowedRoles={['user']}>
      <UserLayout>
        <div className="page-container py-8 px-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  My CV / Curriculum Vitae
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {user?.name} - Europass Format
                </p>
              </div>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-6 py-3 bg-brandBlue text-white rounded-lg hover:bg-brandBlue/90 transition-colors"
              >
                <Download className="w-5 h-5" />
                Download CV
              </button>
            </div>

            {/* CV Content */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-8">
                <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                  {cvContent}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </UserLayout>
    </ProtectedPage>
  );
};

export default CVPage;
