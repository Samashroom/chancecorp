// src/components/CodeChecker.jsx
import { useState } from "react";

function CodeChecker() {
  const [inputCode, setInputCode] = useState("");

  const checkCode = () => {
    if (inputCode === "1234") {
      window.location.href = "/";
    } else {
      alert("Неверный код! Попробуйте ещё раз");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      checkCode();
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1 style={{ marginTop: "unset" }}>Введите промокод:</h1>

      <input
        type="text"
        placeholder="PROMO"
        value={inputCode}
        onChange={(e) => setInputCode(e.target.value)}
        onKeyDown={handleKeyDown} // 👈 Добавленная строка
        style={{ padding: "8px", fontSize: "16px" }}
      />

      <button
        onClick={checkCode}
        style={{ marginLeft: "10px", padding: "8px 16px" }}
      >
        OK
      </button>
    </div>
  );
}

export default CodeChecker;