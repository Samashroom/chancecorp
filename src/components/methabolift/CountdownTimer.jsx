import React, { useState, useEffect } from "react";

const CountdownTimer = ({ initialSeconds = 3600 }) => {

  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return {
      hours: hours.toString().padStart(2, "0"),
      minutes: minutes.toString().padStart(2, "0"),
      seconds: secs.toString().padStart(2, "0"),
    };
  };

  const { hours, minutes, seconds } = formatTime(timeLeft);

  if (timeLeft <= 0) {
    return <div style={styles.timerExpired}>⏰ Время вышло! ⏰</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.timer}>
        <span style={styles.timeValue}>{hours}</span>
        <span style={styles.separator}>:</span>
        <span style={styles.timeValue}>{minutes}</span>
        <span style={styles.separator}>:</span>
        <span style={styles.timeValue}>{seconds}</span>
      </div>
      <div style={styles.label}>КУПИ ПОКА СКИДКА</div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 20px",
    fontFamily: "monospace",
    fontWeight: "bold",
  },
  timer: {
    display: "flex",
    gap: "10px",
    fontSize: "2rem",
    fontWeight: "bold",
  },
  timeValue: {
    backgroundColor: "rgba(0,0,0,0.2)",
    padding: "5px 10px",
    borderRadius: "5px",
    minWidth: "60px",
    textAlign: "center",
  },
  separator: {
    fontSize: "2rem",
    fontWeight: "bold",
    lineHeight: "1",
  },
  label: {
    fontSize: "0.8rem",
    marginTop: "5px",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  timerExpired: {
    padding: "10px 20px",
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#cc0000",
    animation: "pulse 1s infinite",
  },
};

export default CountdownTimer;
