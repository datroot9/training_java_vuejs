/**
 * API Service for Student operations
 * Handles all HTTP requests to the backend
 */

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

const API_BASE_URL = import.meta.env.VITE_API_URL;

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

    console.log(`📡 Calling: ${API_BASE_URL}/students?${params}`);

    const response = await fetch(`${API_BASE_URL}/students?${params}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch students: ${response.statusText}`);
    }

    const apiResponse = await response.json();
    console.log("✅ Response received:", apiResponse);

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
  async addStudent(student: CreateStudent){
    console.log(`📡 Calling: POST ${API_BASE_URL}/students`);

    const response = await fetch(`${API_BASE_URL}/students`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(student),
    });

    if (!response.ok) {
      let errorDetail = response.statusText;
      try {
        const errJson = await response.json();
        console.error("Server 400 error response:", errJson);
        // Spring Boot usually returns an object with a default 'message', or field errors
        if (errJson.message) {
          errorDetail = errJson.message;
        } else if (errJson.errors && Array.isArray(errJson.errors)) {
          errorDetail = errJson.errors.map((e: any) => e.defaultMessage || e.field).join(", ");
        } else if (typeof errJson === 'object') {
          // Flatten arbitrary object values
          errorDetail = Object.values(errJson).join(", ");
        }
      } catch (e) {
        // Not JSON
      }
      throw new Error(errorDetail || "Validation failed from Server");
    }

    console.log("✅ Student added successfully");
  },

  /**
   * Fetch a single student by ID
   */
  async getStudentById(id: number): Promise<Student> {
    console.log(`📡 Calling: GET ${API_BASE_URL}/students/${id}`);

    const response = await fetch(`${API_BASE_URL}/students/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch student details: ${response.statusText}`);
    }

    const apiResponse = await response.json();
    console.log("✅ Student details received:", apiResponse);
    return apiResponse.data;
  },

  /**
   * Update an existing student
   */
  async updateStudent(id: number, student: CreateStudent): Promise<Student> {
    console.log(`📡 Calling: PUT ${API_BASE_URL}/students/${id}`);

    const response = await fetch(`${API_BASE_URL}/students/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(student),
    });

    if (!response.ok) {
      let errorDetail = response.statusText;
      try {
        const errJson = await response.json();
        console.error("Server 400 error response:", errJson);
        if (errJson.message) {
          errorDetail = errJson.message;
        } else if (errJson.errors && Array.isArray(errJson.errors)) {
          errorDetail = errJson.errors.map((e: any) => e.defaultMessage || e.field).join(", ");
        } else if (typeof errJson === 'object') {
          errorDetail = Object.values(errJson).join(", ");
        }
      } catch (e) {
        // Not JSON
      }
      throw new Error(errorDetail || "Update failed from Server");
    }

    const updatedStudent = await response.json();
    console.log("✅ Student updated successfully:", updatedStudent);
    return updatedStudent;
  },

  /**
   * Delete a student by ID
   */
  async deleteStudent(id: number): Promise<void> {
    console.log(`📡 Calling: DELETE ${API_BASE_URL}/students/${id}`);

    const response = await fetch(`${API_BASE_URL}/students/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete student: ${response.statusText}`);
    }

    console.log("✅ Student deleted successfully");
  },

  /**
   * Export students data to manually managed CSV attachment
   */
  async exportStudents(): Promise<void> {
    console.log(`📡 Calling: GET ${API_BASE_URL}/students/export`);

    const response = await fetch(`${API_BASE_URL}/students/export`);

    if (!response.ok) {
      throw new Error(`Failed to export students: ${response.statusText}`);
    }

    // Attempt to grab the perfectly generated Spring resource filename
    const contentDisposition = response.headers.get('Content-Disposition');
    let filename = 'students_export.csv';
    if (contentDisposition && contentDisposition.includes('filename=')) {
      const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
      if (filenameMatch && filenameMatch.length >= 2) {
        filename = filenameMatch[1] || 'students_export.csv';
      }
    }

    // Convert API payload safely to native browser blob and trigger visual download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    
    // Non-intrusively load into Document structure, dynamically trigger, and completely garbage collect!
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    console.log("✅ Students successfully generated and exported!");
  },
};
