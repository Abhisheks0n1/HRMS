import React, { useState} from 'react';
import axios from 'axios';
import { Form, Button, Alert, Col, Row } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AttendanceForm = ({ onAttendanceAdded, employees }) => {
  const [formData, setFormData] = useState({ employee: '', date: new Date(), status: 'Present' });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://hrms-backend-1-05s6.onrender.com/api/attendances/', {
        employee: formData.employee,
        date: formData.date.toISOString().split('T')[0],
        status: formData.status,
      });
      onAttendanceAdded();
      setError(null);
    } catch (err) {
      setError(err.response?.data || 'Error marking attendance');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{JSON.stringify(error)}</Alert>}
      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label>Employee</Form.Label>
            <Form.Select name="employee" value={formData.employee} onChange={handleChange} required>
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.full_name}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <DatePicker selected={formData.date} onChange={handleDateChange} className="form-control" />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select name="status" value={formData.status} onChange={handleChange}>
              <option>Present</option>
              <option>Absent</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      <Button variant="primary" type="submit">Mark Attendance</Button>
    </Form>
  );
};

export default AttendanceForm;