export interface Student {
  id: number;
  code: string;
  name: string;
  birthday: string;
  address: string;
  averageScore: number;
}

export type CreateStudent = Omit<Student, 'id'>;
