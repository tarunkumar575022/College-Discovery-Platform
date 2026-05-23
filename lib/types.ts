export interface User {
  id: string;
  name: string | null;
  email: string;
}

export interface Course {
  id: string;
  name: string;
  duration: string;
  fees: number;
  collegeId: string;
}

export interface Placement {
  id: string;
  avgSalary: number; // in LPA
  highSalary: number; // in LPA
  recruiters: string; // Comma-separated list
  collegeId: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  collegeId: string;
  user: {
    name: string | null;
    email: string;
  };
  createdAt: Date | string;
}

export interface College {
  id: string;
  name: string;
  location: string;
  fees: number;
  rating: number;
  image: string;
  description: string;
  establishedYear: number;
  nirfRanking?: number | null;
  ownership?: string | null;
  courseTypes?: string | null;
  courses?: Course[];
  placements?: Placement[];
  reviews?: Review[];
  savedByUsers?: SavedCollege[];
}

export interface SavedCollege {
  id: string;
  userId: string;
  collegeId: string;
  college: College;
}

export interface SavedComparison {
  id: string;
  userId: string;
  collegeIds: string; // Comma-separated
  createdAt: Date | string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}
