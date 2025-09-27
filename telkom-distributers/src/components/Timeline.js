import React from 'react';

export const Timeline = ({ timeline }) => (
    <div>
        <h3>Case Timeline</h3>
        <ul>
            {timeline.map((item, idx) => (
                <li key={idx}>
                    {item.date} - {item.action} ({item.actor})
                </li>
            ))}
        </ul>
    </div>
);
