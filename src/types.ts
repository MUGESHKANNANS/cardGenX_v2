export interface StudentData {
  'AD NO': string;
  'Student Name': string;
  Batch: string;
  Quota: string;
  Dept: string;
  COMM: string;
  TYPE?: string;
}

export interface StudentCardProps {
  student: StudentData;
}

export interface RequirementsProps {
  requirements: string[];
}

export interface ActionButtonsProps {
  onPreviewToggle: () => void;
  onClearAll: () => void;
  onDownloadCards: () => void;
  showPreview: boolean;
  loading: boolean;
}

export interface SearchFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterDept: string;
  setFilterDept: (dept: string) => void;
  departments: string[];
}

export interface Statistics {
  totalStudents: number;
  departmentCounts: { [key: string]: number };
  quotaCounts: { [key: string]: number };
  communityCounts: { [key: string]: number };
}