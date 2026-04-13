import React, { useState } from 'react';
import '../styles/SafetyGuidance.css';

function SafetyGuidance({ guidance }) {
  const [expandedSections, setExpandedSections] = useState({
    immediate_actions: true,
    dos: false,
    donts: false,
    emergency_checklist: false,
    sos_template: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('📋 Copied to clipboard!');
  };

  const getRiskLevelClass = (riskLevel) => {
    const level = riskLevel?.toLowerCase() || 'unknown';
    return `risk-${level}`;
  };

  return (
    <div className="safety-guidance">
      <h2>📊 Safety Guidance</h2>

      <div className={`risk-level ${getRiskLevelClass(guidance.risk_level)}`}>
        <strong>⚠️ Risk Level:</strong> {guidance.risk_level || 'Unknown'}
      </div>

      <div className="guidance-sections">
        <ExpandableSection
          title="🚀 Immediate Actions"
          isExpanded={expandedSections.immediate_actions}
          onToggle={() => toggleSection('immediate_actions')}
          items={guidance.immediate_actions || []}
        />

        <ExpandableSection
          title="✅ Dos"
          isExpanded={expandedSections.dos}
          onToggle={() => toggleSection('dos')}
          items={guidance.dos || []}
        />

        <ExpandableSection
          title="❌ Don'ts"
          isExpanded={expandedSections.donts}
          onToggle={() => toggleSection('donts')}
          items={guidance.donts || []}
        />

        <ExpandableSection
          title="📋 Emergency Checklist"
          isExpanded={expandedSections.emergency_checklist}
          onToggle={() => toggleSection('emergency_checklist')}
          items={guidance.emergency_checklist || []}
          isChecklist
        />

        {guidance.sos_template && (
          <div className="section">
            <button
              className="section-toggle"
              onClick={() => toggleSection('sos_template')}
            >
              📢 SOS Message Template
              <span className={expandedSections.sos_template ? '▼' : '▶'}>
              </span>
            </button>
            {expandedSections.sos_template && (
              <div className="section-content">
                <div className="sos-template">
                  <pre>{guidance.sos_template}</pre>
                  <button
                    className="btn-copy"
                    onClick={() => copyToClipboard(guidance.sos_template)}
                  >
                    📋 Copy SOS Template
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ExpandableSection({ title, isExpanded, onToggle, items, isChecklist = false }) {
  return (
    <div className="section">
      <button className="section-toggle" onClick={onToggle}>
        {title}
        <span className={isExpanded ? '▼' : '▶'}></span>
      </button>
      {isExpanded && (
        <div className="section-content">
          {Array.isArray(items) && items.length > 0 ? (
            <ul>
              {items.map((item, idx) => (
                <li key={idx}>
                  {isChecklist ? '☐' : '•'} {item}
                </li>
              ))}
            </ul>
          ) : (
            <p>No items available</p>
          )}
        </div>
      )}
    </div>
  );
}

export default SafetyGuidance;
