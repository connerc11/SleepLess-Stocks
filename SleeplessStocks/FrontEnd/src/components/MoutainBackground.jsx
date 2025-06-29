import React from 'react';

const mountainSVG = encodeURIComponent(`
<svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
  <path fill="#4e4376" fill-opacity="1" d="M0,160L80,154.7C160,149,320,139,480,122.7C640,107,800,85,960,101.3C1120,117,1280,171,1360,197.3L1440,224L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path>
</svg>
`);

const mountainSVG2 = encodeURIComponent(`
<svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
  <path fill="#2c3e50" fill-opacity="1" d="M0,224L80,208C160,192,320,160,480,160C640,160,800,192,960,202.7C1120,213,1280,203,1360,197.3L1440,192L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
</svg>
`);

const MountainBackground = () => {
  return (
    <>
      <div style={styles.sky}></div>
      <div style={styles.mountains}></div>
      <div style={styles.mountains2}></div>
      <style>{`
        @keyframes floatMountain {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </>
  );
};

const styles = {
  sky: {
    background: 'linear-gradient(to top, #1d2b64, #f8cdda)',
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    zIndex: 0,
  },
  mountains: {
    background: `url("data:image/svg+xml,${mountainSVG}") no-repeat bottom`,
    backgroundSize: 'cover',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '50%',
    opacity: 0.6,
    animation: 'floatMountain 12s ease-in-out infinite',
    zIndex: 1,
  },
  mountains2: {
    background: `url("data:image/svg+xml,${mountainSVG2}") no-repeat bottom`,
    backgroundSize: 'cover',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '50%',
    opacity: 0.5,
    animation: 'floatMountain 16s ease-in-out infinite',
    zIndex: 1,
  }
};

export default MountainBackground;
