import StatisticLine from "./StatisticLine";

type StatisticsProps = {
  good: number;
  neutral: number;
  bad: number;
  total: number;
  average: number;
  positive: number;
};

const Statistics = ({
  good,
  neutral,
  bad,
  total,
  average,
  positive,
}: StatisticsProps) => {
  return (
    <>
      {total == 0 ? (
        <p>No feedback given</p>
      ) : (
        <div>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="all" value={total} />
          <StatisticLine text="average" value={average} />
          <StatisticLine text="positive" value={positive} symbol="%"/>
        </div>
      )}
    </>
  );
};

export default Statistics;
