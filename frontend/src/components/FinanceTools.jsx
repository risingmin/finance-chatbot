import React from 'react';

const FinanceTools = () => {
    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <div className="page-title">Finance Tools</div>
                    <div className="page-subtitle">Simple calculators and guides to keep your plan on track.</div>
                </div>
                <div className="pill">Beta</div>
            </div>

            <div className="card" style={{ marginTop: '8px' }}>
                <h2>Coming soon</h2>
                <p>Budget templates, savings goal trackers, and debt payoff helpers will live here. For now, use the chat to get personalized steps.</p>
            </div>
        </div>
    );
};

export default FinanceTools;