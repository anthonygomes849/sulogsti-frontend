import { CustomLoadingOverlayProps } from 'ag-grid-react';

export default (
  props: CustomLoadingOverlayProps & { loadingMessage: string }
) => {
  return (
    <i className="fas fa-circle-notch fa-spin fa-6x" style={{ color: "#EA004C" }}></i>
  );
};