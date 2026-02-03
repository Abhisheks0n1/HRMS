import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Table, 
  Button, 
  Card, 
  Alert, 
  Modal 
} from 'react-bootstrap';
import EmployeeForm from './EmployeeForm';
import LoadingSpinner from './LoadingSpinner';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://hrms-backend-1-05s6.onrender.com/api/employees/');
      setEmployees(res.data);
      setError(null);
    } catch (err) {
      setError('Error fetching employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);
  const handleDeleteClick = (id, fullName) => {
    setEmployeeToDelete({ id, fullName });
    setShowDeleteModal(true);
  };
  const confirmDelete = async () => {
    if (!employeeToDelete) return;

    try {
      await axios.delete(`https://hrms-backend-1-05s6.onrender.com/api/employees/${employeeToDelete.id}/`);
      await fetchEmployees();
      setError(null);
    } catch (err) {
      setError('Failed to delete employee. Please try again.');
    }

    setShowDeleteModal(false);
    setEmployeeToDelete(null);
  };


  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setEmployeeToDelete(null);
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return <Alert variant="danger" className="text-center">{error}</Alert>;
  }

  return (
    <>
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-gradient text-white">
          <h5 className="mb-0">Employee Management</h5>
        </Card.Header>

        <Card.Body className="p-4">
          <EmployeeForm onEmployeeAdded={fetchEmployees} />

          {employees.length === 0 ? (
            <div className="empty-state text-center mt-5 py-5">
              <h4 className="text-muted">No employees found</h4>
              <p className="text-secondary">
                Add your first employee using the form above.
              </p>
            </div>
          ) : (
            <div className="table-responsive mt-4">
              <Table striped hover bordered className="align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Employee ID</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th style={{ width: '130px' }} className="text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp.id}>
                      <td className="fw-bold">{emp.employee_id}</td>
                      <td>{emp.full_name}</td>
                      <td>{emp.email}</td>
                      <td>{emp.department || '-'}</td>
                      <td className="text-center">
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteClick(emp.id, emp.full_name)}
                          title="Delete employee"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      <Modal
        show={showDeleteModal}
        onHide={handleCloseModal}
        centered
        backdrop="static" 
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {employeeToDelete && (
            <>
              Are you sure you want to delete <strong>{employeeToDelete.fullName}</strong>?
              <br />
              <small className="text-muted">
              </small>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EmployeeList;