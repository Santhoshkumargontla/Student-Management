
import { useEffect, useState } from 'react';
import './App.css';

const API_URL = '/api/students';

const emptyForm = {
  name: '',
  email: '',
  course: '',
  year: '1',
};

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function loadStudents() {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Could not load students.');
      }

      setStudents(data);
    } catch (err) {
      setError(err.message || 'Unable to connect to the backend.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccess('');

    const student = {
      name: form.name.trim(),
      email: form.email.trim(),
      course: form.course.trim(),
      year: Number(form.year),
    };

    if (!student.name || !student.email || !student.course) {
      setError('Please fill in all fields.');
      return;
    }

    if (!Number.isInteger(student.year) || student.year < 1 || student.year > 6) {
      setError('Year must be a whole number between 1 and 6.');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        editingId ? `${API_URL}/${editingId}` : API_URL,
        {
          method: editingId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(student),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to save student.');
      }

      setSuccess(editingId ? 'Student updated successfully.' : 'Student added successfully.');
      resetForm();
      await loadStudents();
    } catch (err) {
      setError(err.message || 'Something went wrong while saving.');
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(student) {
    setForm({
      name: student.name,
      email: student.email,
      course: student.course,
      year: String(student.year),
    });
    setEditingId(student._id);
    setError('');
    setSuccess('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(student) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${student.name}?`,
    );

    if (!confirmed) return;

    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_URL}/${student._id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to delete student.');
      }

      setSuccess(`${student.name} was deleted successfully.`);
      if (editingId === student._id) resetForm();
      await loadStudents();
    } catch (err) {
      setError(err.message || 'Something went wrong while deleting.');
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Student Hub home">
          <span className="brand-icon">S</span>
          <span>Student<span className="brand-light">Hub</span></span>
        </a>
        <span className="connection-status">
          <span className="status-dot" />
          Student management
        </span>
      </header>

      <section className="hero">
        <p className="eyebrow">STUDENT ADMINISTRATION</p>
        <h1>Manage your students.</h1>
        <p className="hero-description">
          Keep student information organized in one simple workspace.
        </p>

        <div className="stats-card">
          <div className="stat-icon">▤</div>
          <div>
            <p className="stat-label">TOTAL STUDENTS</p>
            <p className="stat-number">{students.length}</p>
          </div>
        </div>
      </section>

      <section className="content-grid">
        <section className="panel form-panel">
          <div className="panel-heading">
            <div>
              <p className="section-kicker">{editingId ? 'EDIT RECORD' : 'NEW RECORD'}</p>
              <h2>{editingId ? 'Update student' : 'Add a student'}</h2>
            </div>
            <span className="heading-icon">{editingId ? '✎' : '+'}</span>
          </div>

          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Ravi Kumar"
              autoComplete="name"
              required
            />

            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="e.g. ravi@example.com"
              autoComplete="email"
              required
            />

            <label htmlFor="course">Course</label>
            <input
              id="course"
              name="course"
              value={form.course}
              onChange={handleChange}
              placeholder="e.g. Computer Science"
              required
            />

            <label htmlFor="year">Year of study</label>
            <select
              id="year"
              name="year"
              value={form.year}
              onChange={handleChange}
              required
            >
              {[1, 2, 3, 4, 5, 6].map((year) => (
                <option key={year} value={year}>
                  Year {year}
                </option>
              ))}
            </select>

            {error && <p className="notice error-notice" role="alert">{error}</p>}
            {success && <p className="notice success-notice" role="status">{success}</p>}

            <button className="primary-button" type="submit" disabled={saving}>
              {saving ? 'Saving...' : editingId ? 'Save changes' : 'Add student'}
            </button>

            {editingId && (
              <button
                className="secondary-button"
                type="button"
                onClick={resetForm}
              >
                Cancel editing
              </button>
            )}
          </form>
        </section>

        <section className="panel list-panel">
          <div className="panel-heading list-heading">
            <div>
              <p className="section-kicker">YOUR DATABASE</p>
              <h2>Student directory</h2>
            </div>
            <button
              className="refresh-button"
              type="button"
              onClick={loadStudents}
              disabled={loading}
            >
              ↻ Refresh
            </button>
          </div>

          {loading ? (
            <div className="empty-state">
              <div className="loader" />
              <p>Loading students...</p>
            </div>
          ) : error && students.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">!</div>
              <h3>Could not load students</h3>
              <p>{error}</p>
              <button className="secondary-button" onClick={loadStudents} type="button">
                Try again
              </button>
            </div>
          ) : students.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">▤</div>
              <h3>No students yet</h3>
              <p>Add your first student using the form.</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>STUDENT</th>
                    <th>COURSE</th>
                    <th>YEAR</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student._id}>
                      <td>
                        <div className="student-cell">
                          <span className="avatar">
                            {student.name.charAt(0).toUpperCase()}
                          </span>
                          <div>
                            <p className="student-name">{student.name}</p>
                            <p className="student-email">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td>{student.course}</td>
                      <td><span className="year-badge">Year {student.year}</span></td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="edit-button"
                            type="button"
                            onClick={() => handleEdit(student)}
                            aria-label={`Edit ${student.name}`}
                          >
                            Edit
                          </button>
                          <button
                            className="delete-button"
                            type="button"
                            onClick={() => handleDelete(student)}
                            aria-label={`Delete ${student.name}`}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </section>

      <footer className="footer">
        <span>StudentHub</span>
        <span>React · Express · MongoDB Atlas</span>
      </footer>
    </main>
  );
}

export default App;

