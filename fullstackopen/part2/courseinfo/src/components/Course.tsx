import type { CourseData, CoursePart } from '../types'
import styles from './Course.module.css'

type CourseProps = { course: CourseData }
type PartProps = { part: CoursePart }

const Header = ({ name }: { name: string }) => <h2>{name}</h2>

const Part = ({ part }: PartProps) => (
  <li className={styles.part}>
    <span>{part.name}</span>
    <span>{part.exercises} exercises</span>
  </li>
)

const Content = ({ parts }: { parts: CoursePart[] }) => (
  <ul className={styles.parts}>
    {parts.map((part) => <Part key={part.id} part={part} />)}
  </ul>
)

const Total = ({ parts }: { parts: CoursePart[] }) => {
  const total = parts.reduce((sum, part) => sum + part.exercises, 0)
  return <p className={styles.total}>Total: {total} exercises</p>
}

const Course = ({ course }: CourseProps) => (
  <section className={styles.course}>
    <Header name={course.name} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
  </section>
)

export default Course
