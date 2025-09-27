// src/mockData.js
export const customers = [
    {
        id: 'customer1',
        fullName: 'John Doe',
        saId: '8001015009087',
        linkedSIMs: [
            { id: 'sim1', number: '0821234567', provider: 'Vodacom', status: 'Active' },
            { id: 'sim2', number: '0827654321', provider: 'MTN', status: 'Active' },
        ],
        fraudCases: [
            {
                caseId: 'case1',
                simId: 'sim1',
                description: 'SIM swap attempt detected',
                itcNumber: 'ITC-2025-0001',
                casNumber: 'CAS-2025-001',
                status: 'CAS Uploaded',
                timeline: [
                    { date: '2025-09-27', action: 'Fraud Report Submitted', actor: 'Customer' },
                    { date: '2025-09-27', action: 'ITC Issued & SIM Blocked', actor: 'System' },
                    { date: '2025-09-27', action: 'CAS Uploaded', actor: 'Customer' },
                ],
            },
        ],
        notifications: [
            { id: 'notif1', message: 'Your SIM has been blocked and ITC issued.', read: false },
        ],
    },
];
