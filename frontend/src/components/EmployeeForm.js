import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Alert } from 'react-bootstrap';

const EmployeeForm = ({ onEmployeeAdded }) => {
  const [formData, setFormData] = useState({ employee_id: '', full_name: '', email: '', department: '' });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://hrms-backend-1-05s6.onrender.com/api/employees/', formData);
      onEmployeeAdded();
      setFormData({ employee_id: '', full_name: '', email: '', department: '' });
      setError(null);
    } catch (err) {
      setError(err.response?.data || 'Error adding employee');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{JSON.stringify(error)}</Alert>}
      <Form.Group className="mb-3">
        <Form.Label>Employee ID</Form.Label>
        <Form.Control name="employee_id" value={formData.employee_id} onChange={handleChange} required />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Full Name</Form.Label>
        <Form.Control name="full_name" value={formData.full_name} onChange={handleChange} required />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control name="email" type="email" value={formData.email} onChange={handleChange} required />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Department</Form.Label>
        <Form.Control name="department" value={formData.department} onChange={handleChange} required />
      </Form.Group>
      <Button variant="primary" type="submit">Add Employee</Button>
    </Form>
  );
};

export default EmployeeForm;