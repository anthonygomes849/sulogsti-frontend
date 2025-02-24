import React from 'react';
import ReactLoading from "react-loading";

import './styles.scss';
interface LoadingProps {
  loading?: boolean;
  backgroundColor?: string;
  spinnerColor?: string;
}

const Loading: React.FC<LoadingProps> = ({
  loading = false,
  backgroundColor = 'rgba(236, 240, 241, 0.7)',
}: LoadingProps) => {
  return (
    <React.Fragment>
      {loading && (
        <div
          className="loading-background"
          style={{ background: backgroundColor }}
        >
          <div className="loading-bar">
            <ReactLoading type='spinningBubbles' color='#0A4984' />
          </div>
        </div>
      )}
    </React.Fragment>
  );
};


export default Loading;