import React from 'react';

export const Notifications = ({ notifications }) => (
    <div>
        <h3>Notifications</h3>
        <ul>
            {notifications.map(n => (
                <li key={n.id}>{n.message} {n.read ? '(Read)' : '(Unread)'}</li>
            ))}
        </ul>
    </div>
);
