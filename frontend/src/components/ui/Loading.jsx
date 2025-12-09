import './Loading.css';

function Loading({ fullScreen = false, message = 'Cargando...' }) {
  const content = (
    <div className="loading-content">
      <div className="loading-spinner"></div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="loading-fullscreen">
        {content}
      </div>
    );
  }

  return content;
}

export default Loading;
