import Part from "./Part";

type ContentProps = {
  part1: string;
  exercises1: number;
  part2: string;
  exercises2: number;
  part3: string;
  exercises3: number;
};

const Content = ({
  part1,
  exercises1,
  part2,
  exercises2,
  part3,
  exercises3,
}: ContentProps) => {
  return (
    <>
      <Part part={part1} exercises={exercises1} />
      <Part part={part2} exercises={exercises2} />
      <Part part={part3} exercises={exercises3} />
    </>
  );
};

export default Content;
