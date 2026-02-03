import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingSpinner = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
  <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
</div>
);

export default LoadingSpinner;