import React from 'react';
import './styles.scss';
interface LoadingProps {
  loading?: boolean;
  backgroundColor?: string;
  spinnerColor?: string;
}

const Loading: React.FC<LoadingProps> = ({
  loading = false,
  backgroundColor = 'rgba(236, 240, 241, 0.7)',
  spinnerColor = '#003475',
}: LoadingProps) => {
  return (
    <React.Fragment>
      {loading && (
        <div
          className="loading-background"
          style={{ background: backgroundColor }}
        >
          <div className="loading-bar">
            <div
              className="loading-circle-1"
              style={{ background: spinnerColor }}
            />
            <div
              className="loading-circle-2"
              style={{ background: spinnerColor }}
            />
          </div>
        </div>
      )}
    </React.Fragment>
  );
};


export default Loading;