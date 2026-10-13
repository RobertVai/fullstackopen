import Part from "./Part";
import type { CoursePart } from "../types/course";

type ContentProps = {
  parts: CoursePart[];
};

const Content = ({
  parts
}: ContentProps) => {
  return (
    <>
      {parts.map((part) => (
        <Part key={part.name} part={part.name} exercises={part.exercises}/>
      ) )}
      
    </>
  );
};

export default Content;
