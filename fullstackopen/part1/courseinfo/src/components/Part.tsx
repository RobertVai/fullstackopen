type PartProps = {
  part: string;
  exercises: number;
};

const Part = ({ part, exercises }: PartProps) => {
  return (
    <div>
      <p>
        {part} : {exercises}
      </p>
    </div>
  );
};

export default Part;
