import { useState, useEffect } from "react";
import "./popup.css";

interface AgreementPopupProps {
  pdfUrl: string; // путь к PDF файлу
  onAgree?: () => void;
}

export default function AgreementPopup({
  pdfUrl,
  onAgree,
}: AgreementPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const userAgreed = localStorage.getItem("userAgreed");
    if (!userAgreed) {
      setTimeout(() => setIsOpen(true), 1000);
    }
  }, []);

  const handleAgree = () => {
    if (!isChecked) {
      alert("Пожалуйста, отметьте согласие.");
      return;
    }

    localStorage.setItem("userAgreed", "true");
    setIsOpen(false);
    if (onAgree) onAgree();
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-header">
          <h2>Пользовательское соглашение</h2>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="download-pdf-btn compact"
          >
            Открыть (PDF)
          </a>
        </div>

        <div className="popup-body">
          <label className="checkbox-label compact">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
            />
            <span>Принимаю условия</span>
          </label>

          <button
            onClick={handleAgree}
            className="agree-btn compact"
            disabled={!isChecked}
          >
            Продолжить
          </button>
        </div>
      </div>
    </div>
  );
}
