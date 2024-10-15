import { useRef, useState, useEffect } from "react";
import ResultsModal from "./ResultsModal";

export default function TimerChallenge({ title, targetTime }) {
  const [timeRemaining, setTimeRemaining] = useState(targetTime * 1000);
  const [timerStarted, setTimerStarted] = useState(false);
  const [showScore, setShowScore] = useState(false); // New state to track when to show modal
  const timer = useRef();
  const dialog = useRef();

  useEffect(() => {
    if (timeRemaining <= 0 && timerStarted) {
      clearInterval(timer.current);
      setTimeRemaining(0); // Ensure time doesn't go negative
      dialog.current.open();
      setShowScore(true); // Show modal when time runs out
      setTimerStarted(false);
    }
  }, [timeRemaining, timerStarted]);

  function handleReset() {
    clearInterval(timer.current);
    setTimeRemaining(targetTime * 1000);
    setTimerStarted(false);
    setShowScore(false); // Reset modal visibility
  }

  function handleStart() {
    if (!timerStarted) {
      setTimerStarted(true);
      timer.current = setInterval(() => {
        setTimeRemaining((prevTimeRemaining) => {
          return Math.max(prevTimeRemaining - 10, 0); // Prevent going negative
        });
      }, 10);
    }
  }

  function handleStop() {
    if (timerStarted) {
      clearInterval(timer.current);
      setTimerStarted(false);
      dialog.current.open(); // Open modal when stopping the timer
      setShowScore(true); // Show modal with score
    }
  }

  const timerIsActive = timeRemaining > 0 && timerStarted;

  return (
    <>
      <ResultsModal
        ref={dialog}
        targetTime={targetTime}
        remainingTime={timeRemaining}
        onReset={handleReset}
        showScore={showScore} // Pass score visibility state to modal
      />
      <section className="challenge">
        <h2>{title}</h2>
        <p className="challenge-time">
          {targetTime} second{targetTime > 1 ? "s" : ""}
        </p>
        <p>
          <button onClick={timerIsActive ? handleStop : handleStart}>
            {timerIsActive ? "Stop" : "Start"} challenge
          </button>
        </p>
        <p className>
          {timerIsActive ? "Time is running... " : "Timer inactive"}
        </p>
      </section>
    </>
  );
}
