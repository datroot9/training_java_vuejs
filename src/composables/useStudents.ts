import { ref } from "vue";
import type { Student, CreateStudent } from "../types/student";
import { studentApi } from "../api/students";

export function useStudents() {
  const students = ref<Student[]>([]);
  const totalCount = ref(0);
  const totalPages = ref(0);
  const currentPage = ref(1);
  const pageSize = ref(10);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const currentSearchParams = ref<{ name?: string; code?: string; birthday?: string }>({});
  const currentSortBy = ref<string | undefined>(undefined);
  const currentSortOrder = ref<"asc" | "desc" | undefined>(undefined);

  const fetchStudents = async (
    page: number = 1,
    pageSize_: number = 10,
    searchParams?: { name?: string; code?: string; birthday?: string },
    sortBy?: string,
    sortOrder?: "asc" | "desc",
  ) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await studentApi.getStudents(
        page, 
        pageSize_, 
        searchParams,
        sortBy,
        sortOrder
      );

      students.value = response.data;
      totalCount.value = response.totalCount;
      totalPages.value = response.totalPages;
      currentPage.value = response.currentPage;
      pageSize.value = response.pageSize;
      
      if (searchParams !== undefined) currentSearchParams.value = searchParams;
      if (sortBy !== undefined) currentSortBy.value = sortBy;
      if (sortOrder !== undefined) currentSortOrder.value = sortOrder;
    } catch (err: any) {
      error.value = err.message || "Failed to load students";
    } finally {
      isLoading.value = false;
    }
  };

  const goToPage = (page: number) => {
    return fetchStudents(
      page, 
      pageSize.value, 
      currentSearchParams.value,
      currentSortBy.value,
      currentSortOrder.value
    );
  };

  const getStudentById = async (id: number): Promise<Student | null> => {
    isLoading.value = true;
    error.value = null;
    try {
      return await studentApi.getStudentById(id);
    } catch (err: any) {
      error.value = err.message || "Failed to load student details";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const addStudent = async (student: CreateStudent): Promise<void> => {
    isLoading.value = true;
    error.value = null;
    try {
      await studentApi.addStudent(student);
    } catch (err: any) {
      error.value = err.message || "Failed to create student";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updateStudent = async (id: number, student: CreateStudent): Promise<void> => {
    isLoading.value = true;
    error.value = null;
    try {
      await studentApi.updateStudent(id, student);
    } catch (err: any) {
      error.value = err.message || "Failed to update student";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteStudent = async (studentId: number) => {
    try {
      isLoading.value = true;
      await studentApi.deleteStudent(studentId);
      await fetchStudents(currentPage.value, pageSize.value);
    } catch (err: any) {
      error.value = err.message || "Failed to delete student";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const exportStudentsData = async () => {
    try {
      isLoading.value = true;
      error.value = null;
      await studentApi.exportStudents();
    } catch (err: any) {
      error.value = err.message || "Failed to export CSV data";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    students,
    totalCount,
    totalPages,
    currentPage,
    pageSize,
    isLoading,
    error,
    currentSearchParams,
    currentSortBy,
    currentSortOrder,
    fetchStudents,
    goToPage,
    getStudentById,
    addStudent,
    updateStudent,
    deleteStudent,
    exportStudentsData,
    isCodeAvailable: async (code: string): Promise<boolean> => {
      try {
        const student = await studentApi.getStudentByCode(code);
        return !student; // If we get a student back, the code is NOT available
      } catch (err) {
        // If it throws an error (like 404), the code is available
        return true;
      }
    }
  };
}
