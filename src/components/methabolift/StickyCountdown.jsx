import React from 'react';
import CountdownTimer from './methabolift/CountDownTimer.jsx';

const StickyCountdown = ({ duration = 3600 }) => {
  return (
    <div style={styles.stickyBar}>
      <CountdownTimer initialSeconds={duration} />
    </div>
  );
};

const styles = {
  stickyBar: {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    backgroundColor: '#FFD700',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(0px)',
    borderBottom: '2px solid rgba(0,0,0,0.1)',
  },
};

export default StickyCountdown;
