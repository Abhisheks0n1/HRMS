import React, { useState, useEffect,useCallback } from "react";
import axios from "axios";
import { Table, Card, Alert, Form, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AttendanceForm from "./AttendanceForm";
import LoadingSpinner from "./LoadingSpinner";

const AttendanceList = () => {
  const [attendances, setAttendances] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [filterDate, setFilterDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEmployees = useCallback(async () => {
  try {
    const res = await axios.get('https://hrms-backend-1-05s6.onrender.com/api/employees/');
    setEmployees(res.data);
  } catch (err) {
    console.error(err);
  }
}, []);

const fetchAttendances = useCallback(async () => {
  setLoading(true);
  try {
    let url = 'https://hrms-backend-1-05s6.onrender.com/api/attendances/';
    const params = {};
    if (selectedEmployee) params.employee_id = selectedEmployee;
    if (filterDate) params.date = filterDate.toISOString().split('T')[0];
    const res = await axios.get(url, { params });
    setAttendances(res.data);
    setError(null);
  } catch (err) {
    setError('Error fetching attendances');
  } finally {
    setLoading(false);
  }
}, [selectedEmployee, filterDate]);

useEffect(() => {
  fetchEmployees();
  fetchAttendances();
}, [fetchEmployees, fetchAttendances]);

  const handleFilter = () => {
    fetchAttendances();
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Card>
      <Card.Header>Attendance Management</Card.Header>
      <Card.Body>
        <AttendanceForm
          onAttendanceAdded={fetchAttendances}
          employees={employees}
        />
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <Form.Label className="fw-medium">Employee</Form.Label>
            <Form.Select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              <option value="">All Employees</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.full_name}
                </option>
              ))}
            </Form.Select>
          </div>

          <div className="col-md-4">
            <Form.Label className="fw-medium">Date Filter (Bonus)</Form.Label>
            <DatePicker
              selected={filterDate}
              onChange={setFilterDate}
              className="form-control"
              placeholderText="Select date"
              isClearable
            />
          </div>

          <div className="col-md-4 d-flex align-items-end">
            <Button variant="primary" onClick={handleFilter} className="w-100">
              Apply Filter
            </Button>
          </div>
        </div>

        {attendances.length === 0 ? (
          <div className="empty-state mt-5">
            <h4>No attendance records found</h4>
            <p>Mark attendance for employees or adjust filters.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table striped hover>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendances.map((att) => (
                  <tr key={att.id}>
                    <td className="fw-medium">
                      {employees.find((e) => e.id === att.employee)
                        ?.full_name || "—"}
                    </td>
                    <td>{att.date}</td>
                    <td>
                      <span
                        className={`badge bg-${att.status === "Present" ? "success" : "danger"}`}
                      >
                        {att.status}
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

export default AttendanceList;
