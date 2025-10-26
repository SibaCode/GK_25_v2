// src/newDash/dashboard/fakeRicaApi.js
export const verifyCompliance = async (userData) => {
  // Simulate API call to RICA compliance service
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: "success",
        message: "Compliance verification passed",
        reference: "RICA-" + Date.now(),
        timestamp: new Date().toISOString()
      });
    }, 2000);
  });
};

export const getLinkedSimsById = async (idNumber) => {
  // Simulate fetching linked SIMs
  return [
    { number: "0821234567", status: "Active", provider: "Vodacom" },
    { number: "0839876543", status: "Inactive", provider: "MTN" }
  ];
};