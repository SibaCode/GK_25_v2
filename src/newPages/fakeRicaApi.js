// src/newDash/dashboard/fakeRicaApi.js

// Simulate a delay for API-like behavior
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Fake database of linked SIMs by ID
const linkedSimsDatabase = {
    "8001015009087": ["0821234567", "0837654321"],
    "9002026009088": ["0812345678"],
    "9503037009089": ["0845678901", "0856789012", "0867890123"],
};

// Function to get linked SIMs
export const getLinkedSimsById = async (idNumber) => {
    await delay(500); // simulate network delay
    return linkedSimsDatabase[idNumber] || [];
};
