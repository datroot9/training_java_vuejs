/**
 * Composable for managing student data and API calls
 * Handles loading state, pagination, errors, etc.
 */

import { ref } from "vue";
import type { Student } from "../types/student";
import { studentApi } from "../api/students";

export function useStudents() {
  // State variables
  const students = ref<Student[]>([]);
  const totalCount = ref(0);
  const totalPages = ref(0);
  const currentPage = ref(1);
  const pageSize = ref(10);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Active query parameters persisted for pagination and refresh
  const currentSearchParams = ref<{ name?: string; code?: string; birthday?: string }>({});
  const currentSortBy = ref<string | undefined>(undefined);
  const currentSortOrder = ref<"asc" | "desc" | undefined>(undefined);

  /**
   * Main function to fetch students from API
   */
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
      console.log(`🔄 Fetching page ${page} with pageSize ${pageSize_}...`);

      const response = await studentApi.getStudents(
        page, 
        pageSize_, 
        searchParams,
        sortBy,
        sortOrder
      );

      // Update all reactive state
      students.value = response.data;
      totalCount.value = response.totalCount;
      totalPages.value = response.totalPages;
      currentPage.value = response.currentPage;
      pageSize.value = response.pageSize;
      
      // Persist the latest query parameters for subsequent calls like goToPage
      if (searchParams !== undefined) currentSearchParams.value = searchParams;
      if (sortBy !== undefined) currentSortBy.value = sortBy;
      if (sortOrder !== undefined) currentSortOrder.value = sortOrder;

      console.log(`✅ Loaded ${students.value.length} students`);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      error.value = errorMsg;
      console.error("❌ Error:", errorMsg);
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Navigate to a specific page
   */
  const goToPage = (page: number) => {
    return fetchStudents(
      page, 
      pageSize.value, 
      currentSearchParams.value,
      currentSortBy.value,
      currentSortOrder.value
    );
  };

  /**
   * Delete a student and reload data
   */
  const deleteStudent = async (studentId: number) => {
    try {
      isLoading.value = true;
      await studentApi.deleteStudent(studentId);

      // Reload current page
      await fetchStudents(currentPage.value, pageSize.value);
      console.log("✅ Student deleted and data reloaded");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to delete";
      error.value = errorMsg;
      console.error("❌ Delete error:", errorMsg);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Export all currently mapped students into native standard CSV output
   */
  const exportStudentsData = async () => {
    try {
      isLoading.value = true;
      error.value = null;
      await studentApi.exportStudents();
      console.log("✅ Student baseline CSV payload exported seamlessly");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to export CSV output payload";
      error.value = errorMsg;
      console.error("❌ Local Export error block:", errorMsg);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    // State
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

    // Methods
    fetchStudents,
    goToPage,
    deleteStudent,
    exportStudentsData,
  };
}
