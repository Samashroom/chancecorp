import React, { useState, useEffect, useRef } from 'react';
import './TickerBar.css';

const BAR_ENTER_MS = 300;
const VISIBLE_MS = 8000;
const BAR_EXIT_MS = 500;
const MIN_MESSAGE_INTERVAL_MS = 20000;
const INITIAL_DELAY_MS = 2000;

const TickerBar = () => {
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const autoHideRef = useRef(null);
  const exitRef = useRef(null);
  const nextMessageRef = useRef(null);
  const initialTimeoutRef = useRef(null);

  const messages = [
    'Только что был куплен товар 1 ед. Количество товара ограничено!',
    'Срочно! Старая цена - ВСЁ!',
    'Пользователь из Сити только что оформил заказ!',
    'Осталось совсем немного до повышения цены! Успейте купить!',
    'Только что: скидка 50% активирована! Промокод: METHA2205',
    'Товар заканчивается!',
    'Рекорд продаж! 1500 упаковок за сегодня!',
    'Доставка доступна по всей высоте ШансТауэр!',
    'Отзыв: "Methabolift изменил мою жизнь!"',
    'Внимание! Осталось всего 2 упаковки по акции!',
    'БЫСТРЕЕ! СКОРЕЕ! ГОРЯЧО!',
  ];

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const generateRandomMessage = () => {
    const randomIndex = Math.floor(Math.random() * messages.length);
    const time = getCurrentTime();
    return `🔴 ${time} ${messages[randomIndex]} `;
  };

  const clearTimers = () => {
    if (autoHideRef.current) clearTimeout(autoHideRef.current);
    if (exitRef.current) clearTimeout(exitRef.current);
    if (nextMessageRef.current) clearTimeout(nextMessageRef.current);
  };

  const triggerExit = () => {
    if (autoHideRef.current) clearTimeout(autoHideRef.current);
    if (exitRef.current) clearTimeout(exitRef.current);

    setIsExiting(true);
    exitRef.current = setTimeout(() => {
      setIsVisible(false);
      setIsExiting(false);
    }, BAR_EXIT_MS);
  };

  const scheduleNextMessage = () => {
    nextMessageRef.current = setTimeout(() => {
      showMessage();
    }, MIN_MESSAGE_INTERVAL_MS);
  };

  const showMessage = () => {
    clearTimers();

    const newMessage = generateRandomMessage();
    setMessage(newMessage);
    setIsVisible(true);
    setIsExiting(false);

    autoHideRef.current = setTimeout(() => {
      triggerExit();
    }, VISIBLE_MS);

    scheduleNextMessage();
  };

  useEffect(() => {
    initialTimeoutRef.current = setTimeout(showMessage, INITIAL_DELAY_MS);

    return () => {
      if (initialTimeoutRef.current) clearTimeout(initialTimeoutRef.current);
      clearTimers();
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`ticker-bar${isExiting ? ' ticker-exit' : ''}`}>
      <div className="ticker-container">
        <div className="ticker-content">
          <div className="ticker-message" key={message}>
            {message}
          </div>
        </div>
        <button className="ticker-close" onClick={triggerExit}>✕</button>
      </div>
    </div>
  );
};

export default TickerBar;
