export interface Parameter {
    name: string
    points: number
}

export interface Student {
    id: number
    name: string
    scores: { [key: string]: number }
    isEditing: boolean
}

export const studentsData: Student[] = [
    { id: 1, name: "William Donds", scores: { "Mid Exam": 45, "Final Exam": 45 }, isEditing: false },
    { id: 2, name: "Alan Becker", scores: { "Mid Exam": 45, "Final Exam": 45 }, isEditing: false },
    { id: 3, name: "Emma Thompson", scores: { "Mid Exam": 42, "Final Exam": 48 }, isEditing: false },
    { id: 4, name: "Michael Chen", scores: { "Mid Exam": 47, "Final Exam": 43 }, isEditing: false },
    { id: 5, name: "Sophia Rodriguez", scores: { "Mid Exam": 44, "Final Exam": 46 }, isEditing: false },
    { id: 6, name: "Liam O'Connor", scores: { "Mid Exam": 46, "Final Exam": 44 }, isEditing: false },
    { id: 7, name: "Zoe Nakamura", scores: { "Mid Exam": 43, "Final Exam": 47 }, isEditing: false },
    { id: 8, name: "Hassan Al-Farsi", scores: { "Mid Exam": 48, "Final Exam": 42 }, isEditing: false },
  ]