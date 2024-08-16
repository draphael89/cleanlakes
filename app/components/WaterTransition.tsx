import React from 'react';

const WaveTransition: React.FC = () => {
  return (
    <div className="wave-transition">
      <svg viewBox="0 0 1440 100" xmlns="http://www.w3.org/2000/svg">
        <path
          fill="currentColor"
          d="M0,50 C150,100 350,0 500,50 C650,100 800,0 1000,50 C1200,100 1350,0 1440,50 V100 H0 V50Z"
        />
      </svg>
    </div>
  );
};

export default WaveTransition;