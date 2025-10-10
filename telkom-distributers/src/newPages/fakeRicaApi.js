// src/fakeRicaAPI.js

export async function getRicaData(idNumber) {
  // Simulate network delay
  await new Promise((res) => setTimeout(res, 500));

  if (!/^\d{13}$/.test(idNumber)) {
    throw new Error("Invalid ID number format");
  }

  // Demo data
  const fakeData = {
    "9001015800087": [
      { number: "0831234567", status: "active" },
      { number: "0847654321", status: "frozen" },
    ],
    "9205055800089": [
      { number: "0825556677", status: "active" },
      { number: "0813339999", status: "active" },
    ],
  };

  return fakeData[idNumber] || [
    { number: "0830000000", status: "unregistered" },
  ];
}
