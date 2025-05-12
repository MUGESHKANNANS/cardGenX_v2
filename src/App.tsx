import React, { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { StudentData, Statistics } from './types';
import { Requirements } from './components/Requirements';
import { StudentCard } from './components/StudentCard';
import { ActionButtons } from './components/ActionButtons';
import { SearchFilter } from './components/SearchFilter';
import { StatisticsPanel } from './components/Statistics';
import { Charts } from './components/Charts';
import { generatePDF } from './utils/pdfGenerator';
import Footer from "./components/Footer";

function App() {
  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [showCharts, setShowCharts] = useState(false);

  const requirements = [
    "Excel file must contain columns: AD NO, Student Name, Batch, Quota, Dept, COMM, TYPE (optional)",
    "Each page will display 10 cards (2 columns × 5 rows)",
    "File must be in .xlsx or .xls format",
    "Student names should not exceed 50 characters",
    "All required fields must be filled"
  ];

  const calculateStatistics = (data: StudentData[]): Statistics => {
    const stats: Statistics = {
      totalStudents: data.length,
      departmentCounts: {},
      quotaCounts: {},
      communityCounts: {},
    };

    data.forEach(student => {
      stats.departmentCounts[student.Dept] = (stats.departmentCounts[student.Dept] || 0) + 1;
      stats.quotaCounts[student.Quota] = (stats.quotaCounts[student.Quota] || 0) + 1;
      stats.communityCounts[student.COMM] = (stats.communityCounts[student.COMM] || 0) + 1;
    });

    return stats;
  };

  const handleFileUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json<StudentData>(worksheet);
      setStudents(jsonData);
      setShowPreview(true);
      setShowCharts(true);
    };
    reader.readAsBinaryString(file);
  }, []);

  const handleDownloadCards = async () => {
    if (students.length === 0) return;
    
    setLoading(true);
    try {
      const blob = await generatePDF(filterStudents(students));
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'student-cards.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = useCallback(() => {
    setStudents([]);
    setShowPreview(false);
    setSearchTerm('');
    setFilterDept('');
    setShowCharts(false);
  }, []);

  const filterStudents = (studentList: StudentData[]) => {
    return studentList.filter(student => {
      const matchesSearch = Object.values(student).some(value => 
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchesDept = filterDept ? student.Dept === filterDept : true;
      return matchesSearch && matchesDept;
    });
  };

  React.useEffect(() => {
    const handleFileSelected = (e: Event) => {
      const file = (e as CustomEvent<File>).detail;
      handleFileUpload(file);
    };

    window.addEventListener('file-selected', handleFileSelected);
    return () => window.removeEventListener('file-selected', handleFileSelected);
  }, [handleFileUpload]);

  const departments = [...new Set(students.map(s => s.Dept))];
  const filteredStudents = filterStudents(students);
  const statistics = calculateStatistics(filteredStudents);

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h1 className="text-2xl font-bold mb-4">Student Card Generator</h1>

            <Requirements requirements={requirements} />

            <ActionButtons
              onPreviewToggle={() => setShowPreview(!showPreview)}
              onClearAll={handleClearAll}
              onDownloadCards={handleDownloadCards}
              showPreview={showPreview}
              loading={loading}
            />

            {students.length > 0 && (
              <>
                <StatisticsPanel stats={statistics} />
                {showCharts && <Charts stats={statistics} />}
                <SearchFilter
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  filterDept={filterDept}
                  setFilterDept={setFilterDept}
                  departments={departments}
                />
              </>
            )}

            {showPreview && filteredStudents.length > 0 && (
              <>
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-700">
                    Preview: Showing {filteredStudents.length} cards across {Math.ceil(filteredStudents.length / 10)} pages
                  </p>
                </div>

                <div id="visible-printable" className="space-y-14">
                  {Array.from({ length: Math.ceil(filteredStudents.length / 10) }).map((_, pageIndex) => (
                    <div
                      key={pageIndex}
                      className="grid grid-cols-2 gap-4 p-8 bg-white rounded-lg shadow-sm"
                      style={{
                        width: '794px',
                        padding: '20mm',
                        boxSizing: 'border-box',
                      }}
                    >
                      {filteredStudents
                        .slice(pageIndex * 10, (pageIndex + 1) * 10)
                        .map((student) => (
                          <StudentCard key={student['AD NO']} student={student} />
                        ))}
                    </div>
                  ))}
                </div>
              </>
            )}

            {showPreview && filteredStudents.length === 0 && (
              <div className="text-center p-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No matching cards found</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default App;