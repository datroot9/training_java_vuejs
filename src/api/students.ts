import { apiClient } from './apiClient';
import type { Student, CreateStudent } from '../types/student';

export interface PaginatedResponse {
  data: any[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export const studentApi = {
  /**
   * Fetch students with pagination and filtering
   */
  async getStudents(
    page: number = 1,
    pageSize: number = 10,
    searchParams?: { name?: string; code?: string; birthday?: string },
    sortBy?: string,
    sortOrder?: "asc" | "desc",
  ): Promise<PaginatedResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });

    if (searchParams?.name) params.append("name", searchParams.name);
    if (searchParams?.code) params.append("code", searchParams.code);
    if (searchParams?.birthday) params.append("birthday", searchParams.birthday);
    if (sortBy) params.append("sortBy", sortBy);
    if (sortOrder) params.append("sortDirection", sortOrder);

    const apiResponse = await apiClient.get(`/students?${params}`);
    
    // Transform the nested API response to match PaginatedResponse interface
    const studentData = apiResponse.data;
    return {
      data: studentData.data,
      totalCount: studentData.totalElements,
      totalPages: studentData.totalPages,
      currentPage: studentData.currentPage,
      pageSize: studentData.pageSize,
      hasNext: studentData.hasNext,
      hasPrevious: studentData.hasPrevious,
    };
  },

  async addStudent(student: CreateStudent) {
    return apiClient.post('/students', student);
  },

  async getStudentById(id: number): Promise<Student> {
    const apiResponse = await apiClient.get(`/students/${id}`);
    return apiResponse.data;
  },

  async getStudentByCode(code: string): Promise<Student> {
    const apiResponse = await apiClient.get(`/students/code/${code}`);
    return apiResponse.data;
  },

  async updateStudent(id: number, student: CreateStudent): Promise<Student> {
    return apiClient.put(`/students/${id}`, student);
  },

  async deleteStudent(id: number): Promise<void> {
    return apiClient.delete(`/students/${id}`);
  },

  async exportStudents(): Promise<void> {
    // Handling blob specifically since apiClient.get assumes JSON
    const API_BASE_URL = import.meta.env.VITE_API_URL;
    const response = await fetch(`${API_BASE_URL}/students/export`, {
      headers: apiClient.getHeaders(true)
    });

    if (!response.ok) {
      throw new Error(`Failed to export students: ${response.statusText}`);
    }

    const contentDisposition = response.headers.get('Content-Disposition');
    let filename = 'students_export.csv';
    if (contentDisposition && contentDisposition.includes('filename=')) {
      const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
      if (filenameMatch && filenameMatch.length >= 2) {
        filename = filenameMatch[1] || 'students_export.csv';
      }
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
};
