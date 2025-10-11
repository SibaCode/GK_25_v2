import React, { useState } from 'react';

export const FraudReportForm = ({ onSubmit }) => {
    const [simId, setSimId] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = e => {
        e.preventDefault();
        onSubmit({ simId, description });
        setSimId('');
        setDescription('');
    };

    return (
        <div>
            <h3>Report Fraud</h3>
            <form onSubmit={handleSubmit}>
                <input
                    placeholder="SIM ID"
                    value={simId}
                    onChange={e => setSimId(e.target.value)}
                />
                <input
                    placeholder="Description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};
