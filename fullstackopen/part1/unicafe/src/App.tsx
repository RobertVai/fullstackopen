import { useState } from "react";
import Statistics from "./components/Statistics";

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const handleClickGood = () => {
    return setGood(good + 1);
  };

  const handleClickNeutral = () => {
    return setNeutral(neutral + 1);
  };

  const handleClickBad = () => {
    return setBad(bad + 1);
  };

  const total = good + neutral + bad;

  const average = total > 0 ? (good - bad) / total : 0;

  const positive = total > 0 ? (good / total) * 100 : 0;

  return (
    <div>
      <h1>give feedback</h1>
      <button onClick={handleClickGood}>Good</button>
      <button onClick={handleClickNeutral}>Neutral</button>
      <button onClick={handleClickBad}>Bad</button>
      <h2>statistics</h2>
      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
        total={total}
        average={average}
        positive={positive}
      />
    </div>
  );
};

export default App;
