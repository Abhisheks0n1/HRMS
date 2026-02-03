import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Table, Alert } from 'react-bootstrap';
import LoadingSpinner from './LoadingSpinner';

const Dashboard = () => {
  const [summary, setSummary] = useState({ total_employees: 0, attendance_summary: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get('https://hrms-backend-1-05s6.onrender.com/api/dashboard/');
        setSummary(res.data);
        setError(null);
      } catch (err) {
        setError('Error fetching dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (


<Card className="shadow-sm">
  <Card.Header className="text-white">
    <h5 className="mb-0">HR Dashboard Overview</h5>
  </Card.Header>
  <Card.Body className="p-4">
    <div className="row g-4 mb-5">
      <div className="col-md-4">
        <div className="p-4 bg-white border rounded-3 text-center shadow-sm">
          <h6 className="text-muted mb-2">Total Employees</h6>
          <h2 className="text-primary mb-0">{summary.total_employees}</h2>
        </div>
      </div>
    </div>

    <h6 className="mb-3 fw-semibold">Attendance Summary</h6>
    
    {summary.attendance_summary.length === 0 ? (
      <div className="empty-state py-5">
        <p>No attendance data recorded yet.</p>
      </div>
    ) : (
      <div className="table-responsive">
        <Table striped hover>
          <thead>
            <tr>
              <th>Employee Name</th>
              <th className="text-center">Present Days</th>
            </tr>
          </thead>
          <tbody>
            {summary.attendance_summary.map((item, idx) => (
              <tr key={idx}>
                <td className="fw-medium">{item.employee__full_name}</td>
                <td className="text-center">
                  <span className="badge bg-success fs-6 px-3 py-2">
                    {item.total_present}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    )}
  </Card.Body>
    </Card>
  );
};

export default Dashboard;