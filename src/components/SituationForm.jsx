import React, { useState } from 'react';
import '../styles/SituationForm.css';

function SituationForm({ onSubmit, loading }) {
  const [situation, setSituation] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!situation.trim()) {
      alert('Please describe your situation first.');
      return;
    }
    onSubmit(situation);
  };

  return (
    <form className="situation-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="situation">📝 Describe Your Situation</label>
        <textarea
          id="situation"
          value={situation}
          onChange={(e) => setSituation(e.target.value)}
          placeholder="Example: I'm waiting for a bus at night and there are few people around..."
          rows={6}
          disabled={loading}
        />
      </div>
      <button
        type="submit"
        className="btn-primary"
        disabled={loading}
      >
        {loading ? '🔄 Generating...' : '🔍 Generate Safety Guidance'}
      </button>
    </form>
  );
}

export default SituationForm;
