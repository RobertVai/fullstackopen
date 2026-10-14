type StatisticLineProps = {
  text: string;
  value: number;
  symbol?: string;
};
const StatisticLine = ({ text, value, symbol }: StatisticLineProps) => {
  return (
    <p>
      {text} {value}
      {symbol}
    </p>
  );
};

export default StatisticLine;
