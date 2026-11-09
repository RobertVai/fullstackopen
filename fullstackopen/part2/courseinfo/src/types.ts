export type CoursePart = {
  id: number
  name: string
  exercises: number
}

export type CourseData = {
  id: number
  name: string
  parts: CoursePart[]
}
