type TotalProps = {
  exercises1: number;
  exercises2: number;
  exercises3: number;
};
const Total = ({ exercises1, exercises2, exercises3 }: TotalProps) => {
  return <p>Number of exercises: {exercises1 + exercises2 + exercises3}</p>;
};

export default Total;
