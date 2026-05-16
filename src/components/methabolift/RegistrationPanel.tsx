// src/components/RegistrationPanel.tsx
import { useState } from 'react';

type RegistrationMethod = 'account' | 'service';

export default function RegistrationPanel() {
  const [method, setMethod] = useState<RegistrationMethod>('account');
  const [accountNumber, setAccountNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLinked, setIsLinked] = useState(false);

  const handleLinkService = () => {
    setIsLinked(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (method === 'account') {
      console.log('Регистрация по номеру счёта:', { accountNumber, password });
      alert(`Номер счёта ${accountNumber} не существует`);
    } else {
      console.log('Регистрация через сервис');
      alert('Регистрация через внешний сервис (демо)');
    }
  };

  return (
    <div className="registration-panel">
      {/* Панель переключения */}
      <div className="method-tabs">
        <button
          className={method === 'account' ? 'active' : ''}
          onClick={() => setMethod('account')}
        >
          Регистрация по номеру счёта
        </button>
        <button
          className={method === 'service' ? 'active' : ''}
          onClick={() => setMethod('service')}
        >
          o-MEGA
        </button>
      </div>

      {/* Форма регистрации */}
      <form onSubmit={handleSubmit}>
        {method === 'account' ? (
          <>
            <div className="form-group">
              <label htmlFor="accountNumber">Номер счёта</label>
              <input
                id="accountNumber"
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Введите номер счёта"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Пароль</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Придумайте пароль"
                required
              />
            </div>
            <button type="submit" className="submit-btn">
              Зарегистрироваться
            </button>
          </>
        ) : (
          <div className="service-registration">
            <button
              type="button"
              onClick={handleLinkService}
              className="link-service-btn"
              disabled={isLinked}
            >
              {isLinked ? 'Аккаунт не найден' : 'Привязать аккаунт'}
            </button>
            <p>Нет омега аккаунта? <a href="/omega">Регистрация</a></p>
          </div>
        )}
      </form>

      <style>{`
        .registration-panel {
          max-width: 400px;
          margin: 0 auto;
          padding: 1.5rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          font-family: system-ui, -apple-system, sans-serif;
        }
        .method-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 0.5rem;
        }
        .method-tabs button {
          flex: 1;
          padding: 0.5rem 1rem;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.9rem;
          border-radius: 6px;
          transition: all 0.2s;
        }
        .method-tabs button.active {
          background: #3b82f6;
          color: white;
        }
        .method-tabs button:not(.active):hover {
          background: #f1f5f9;
        }
        .form-group {
          margin-bottom: 1rem;
        }
        .form-group label {
          display: block;
          margin-bottom: 0.25rem;
          font-weight: 500;
          font-size: 0.9rem;
        }
        .form-group input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          font-size: 1rem;
        }
        .submit-btn, .link-service-btn {
          width: 100%;
          padding: 0.75rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        .submit-btn:hover, .link-service-btn:hover:not(:disabled) {
          background: #2563eb;
        }
        .link-service-btn:disabled {
          background: #474747;
          cursor: default;
        }
        .service-registration {
          text-align: center;
        }
        .service-registration p {
          color: #64748b;
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
}