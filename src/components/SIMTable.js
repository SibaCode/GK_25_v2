import React from 'react';

export const SIMTable = ({ sims }) => (
    <div>
        <h3>Linked SIMs</h3>
        <table border="1" cellPadding="5">
            <thead>
                <tr>
                    <th>Number</th>
                    <th>Provider</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {sims.map(sim => (
                    <tr key={sim.id}>
                        <td>{sim.number}</td>
                        <td>{sim.provider}</td>
                        <td>{sim.status}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);
