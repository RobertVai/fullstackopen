import type { CoursePart } from "../types/course";

type TotalProps = {
  parts: CoursePart[];
};
const Total = ({ parts }: TotalProps) => {
  const totalExercises = parts.reduce(
    (total, part) => total + part.exercises,
    0,
  );
  return <p>Number of exercises: {totalExercises}</p>;
};

export default Total;
