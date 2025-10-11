// src/newDash/dashboard/fakeRicaAPI.js

// Demo linked SIM data by ID number
const demoSims = {
  "9001015800087": [
    { number: "0831234567", status: "Active", provider: "Telkom" },
    { number: "0849876543", status: "Suspended", provider: "Cell C" },
  ],
  "8002024800089": [
    { number: "0823456789", status: "Active", provider: "Vodacom" },
  ],
};

// Simulate fetching linked SIMs by ID with a delay
export const getLinkedSimsById = async (idNumber) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(demoSims[idNumber] || []);
    }, 700); // simulate network/API delay
  });
};
