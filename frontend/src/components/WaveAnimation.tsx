


const WaveAnimation = ({ IsPlaying }) => {

  return (
    <div className={`flex items-center justify-center gap-1 ml-3 ${IsPlaying ? 'animate-wave' : ''}`}>
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className={`bg-green-400 rounded-full transition-all duration-300 ${
            IsPlaying 
              ? `animate-bounce wave-bar-${i + 1}` 
              : 'h-2'
          }`}
          style={{
            width: '3px',
            height: IsPlaying ? '8px' : '8px',
            animationDelay: `${i * 0.1}s`,
            animationDuration: '0.6s',
            animationIterationCount: 'infinite',
            animationDirection: 'alternate'
          }}
        />
      ))}
      <style jsx>{`
        @keyframes wave-pulse {
          0%, 100% { height: 8px; background-color: #10b981; }
          25% { height: 16px; background-color: #34d399; }
          50% { height: 12px; background-color: #6ee7b7; }
          75% { height: 20px; background-color: #34d399; }
        }
        
        .wave-bar-1 {
          animation: wave-pulse 0.8s infinite ease-in-out;
          animation-delay: 0s;
        }
        
        .wave-bar-2 {
          animation: wave-pulse 0.8s infinite ease-in-out;
          animation-delay: 0.2s;
        }
        
        .wave-bar-3 {
          animation: wave-pulse 0.8s infinite ease-in-out;
          animation-delay: 0.4s;
        }
        
        .wave-bar-4 {
          animation: wave-pulse 0.8s infinite ease-in-out;
          animation-delay: 0.6s;
        }
      `}</style>
    </div>
  );
};

export default WaveAnimation;
