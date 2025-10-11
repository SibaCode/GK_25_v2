import { useState } from "react";

const AddSIMFraudModal = ({ onAdd }) => {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        phoneNumber: "",
        customerID: "",
        reportedIssue: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const { phoneNumber, customerID } = formData;

        if (!phoneNumber || !customerID) {
            alert("Please fill in all required fields");
            return;
        }

        if (onAdd) onAdd(formData);

        alert(`SIM fraud report for ${phoneNumber} submitted successfully`);

        setFormData({ phoneNumber: "", customerID: "", reportedIssue: "" });
        setOpen(false);
    };

    return (
        <>
            <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={() => setOpen(true)}
            >
                Report SIM Fraud
            </button>

            {open && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded w-96">
                        <h2 className="text-xl font-bold mb-4">Report SIM Fraud</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block mb-1 font-medium">Phone Number *</label>
                                <input
                                    type="tel"
                                    className="w-full border p-2 rounded"
                                    value={formData.phoneNumber}
                                    onChange={(e) =>
                                        setFormData({ ...formData, phoneNumber: e.target.value })
                                    }
                                    placeholder="e.g., 0711234567"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 font-medium">Customer ID *</label>
                                <input
                                    type="text"
                                    className="w-full border p-2 rounded"
                                    value={formData.customerID}
                                    onChange={(e) =>
                                        setFormData({ ...formData, customerID: e.target.value })
                                    }
                                    placeholder="Enter customer ID"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 font-medium">Reported Issue</label>
                                <textarea
                                    className="w-full border p-2 rounded"
                                    rows={3}
                                    value={formData.reportedIssue}
                                    onChange={(e) =>
                                        setFormData({ ...formData, reportedIssue: e.target.value })
                                    }
                                    placeholder="Describe the reported fraud concern..."
                                />
                            </div>

                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    className="px-4 py-2 border rounded"
                                    onClick={() => setOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddSIMFraudModal;
