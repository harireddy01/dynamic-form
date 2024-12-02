// eslint-disable-next-line no-unused-vars
import React,{ useState, useEffect } from 'react';
// Mock API Response
const apiResponses = {
  userInfo: {
    fields: [
      { name: "firstName", type: "text", label: "First Name", required: true },
      { name: "lastName", type: "text", label: "Last Name", required: true },
      { name: "age", type: "number", label: "Age", required: true },
    ],
  },
  addressInfo: {
    fields: [
      { name: "street", type: "text", label: "Street", required: true },
      { name: "city", type: "text", label: "City", required: true },
      {
        name: "state",
        type: "dropdown",
        label: "State",
        options: ["California", "Texas", "New York"],
        required: true,
      },
      { name: "zipCode", type: "text", label: "Zip Code", required: true },
    ],
  },
  paymentInfo: {
    fields: [
      { name: "cardNumber", type: "text", label: "Card Number", required: true },
      { name: "expiryDate", type: "date", label: "Expiry Date", required: true },
      { name: "cvv", type: "text", label: "CVV", required: true },
      {
        name: "cardholderName",
        type: "text",
        label: "Cardholder Name",
        required: true,
      },
    ],
  },
};

const DynamicForm = () => {
  const [formType, setFormType] = useState("");
  const [formData, setFormData] = useState({});
  const [tableData, setTableData] = useState([]);
  const [currentRowData, setCurrentRowData] = useState({});
  const [formCount, setFormCount] = useState(0);
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleFormTypeChange = (event) => {
    setFormType(event.target.value);
    setFormData({});
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const requiredFields = apiResponses[formType].fields.filter((field) => field.required);
    const isFormValid = requiredFields.every((field) => formData[field.name]?.trim() !== "");

    if (!isFormValid) {
      alert("Please fill in all required fields.");
      return;
    }

    // Additional validation for card number and CVV
    if (formType === "paymentInfo") {
      const cardNumber = formData.cardNumber?.trim();
      const cvv = formData.cvv?.trim();

      if (!/^\d+$/.test(cardNumber)) {
        alert("Card Number must be numeric.");
        return;
      }

      if (!/^\d{3}$/.test(cvv)) {
        alert("CVV must be a 3-digit numeric value.");
        return;
      }
    }

    if (editRowIndex !== null) {
      const updatedTableData = tableData.map((row, index) =>
        index === editRowIndex ? { ...row, ...formData } : row
      );
      setTableData(updatedTableData);
      setEditRowIndex(null);
      setFormType("");
      setFormData({});
      setCurrentRowData({});
      setFormCount(0);
      alert("Changes saved successfully.");
      return;
    }

    const updatedCurrentRowData = { ...currentRowData, ...formData };
    setCurrentRowData(updatedCurrentRowData);

    if (formCount === 2) {
      setTableData((prevData) => [...prevData, updatedCurrentRowData]);
      setCurrentRowData({});
      setFormCount(0);
    } else {
      setFormCount((prevCount) => prevCount + 1);
      setShowPopup(true); // Show the popup to fill the next form
    }

    setFormData({});
    setFormType("");
  };

  const handleEdit = (index) => {
    setEditRowIndex(index);
    setCurrentRowData(tableData[index]);
    setFormData(tableData[index]);
    setFormType("userInfo");
    setFormCount(2);
  };

  const handleDelete = (index) => {
    const updatedTableData = tableData.filter((_, i) => i !== index);
    setTableData(updatedTableData);
    setEditRowIndex(null);
    alert("Entry deleted successfully.");
  };

  const closePopup = () => {
    setShowPopup(false);
    if (formCount === 1) setFormType("addressInfo");
    else if (formCount === 2) setFormType("paymentInfo");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <header style={{ textAlign: "center", marginBottom: "20px" }}>
        <h1>Dynamic Form</h1>
      </header>

      {/* Progress Bar */}
      <div style={{ marginBottom: "20px" }}>
        <div
          style={{
            height: "20px",
            background: "#f0f0f0",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${(formCount / 3) * 100}%`,
              background: "green",
              transition: "width 0.5s",
            }}
          ></div>
        </div>
        <p style={{ textAlign: "right", marginTop: "5px" }}>
          Progress: {Math.round((formCount / 3) * 100)}%
        </p>
      </div>

      <select
        onChange={handleFormTypeChange}
        value={formType}
        style={{
          padding: "10px",
          marginBottom: "20px",
          width: "100%",
          maxWidth: "250px",
          margin: "0 auto",
          display: "block",
        }}
      >
        <option value="">Select Form Type</option>
        <option value="userInfo">User Information</option>
        <option value="addressInfo">Address Information</option>
        <option value="paymentInfo">Payment Information</option>
      </select>

      {formType && (
        <form onSubmit={handleSubmit}>
          {apiResponses[formType].fields.map((field) => (
            <div key={field.name} style={{ marginBottom: "10px", width: "100%" }}>
              <label>{field.label}</label>
              {field.type === "dropdown" ? (
                <select
                  name={field.name}
                  onChange={handleChange}
                  value={formData[field.name] || ""}
                  style={{
                    padding: "10px",
                    width: "100%",
                    boxSizing: "border-box",
                    marginTop: "5px",
                  }}
                >
                  <option value="">Select {field.label}</option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  onChange={handleChange}
                  value={formData[field.name] || ""}
                  style={{
                    padding: "10px",
                    width: "100%",
                    boxSizing: "border-box",
                    marginTop: "5px",
                  }}
                />
              )}
            </div>
          ))}
          <button
            type="submit"
            style={{
              padding: "10px",
              marginTop: "10px",
              width: "100%",
              boxSizing: "border-box",
              backgroundColor: "#4CAF50",
              color: "white",
            }}
          >
            {editRowIndex !== null ? "Update" : "Submit"}
          </button>
        </form>
      )}

      <div>
        <h2>Submitted Data</h2>
        <table
          border="1"
          style={{
            width: "100%",
            textAlign: "left",
            marginTop: "10px",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              {[...apiResponses.userInfo.fields, ...apiResponses.addressInfo.fields, ...apiResponses.paymentInfo.fields].map(
                (field) => (
                  <th key={field.name}>{field.label}</th>
                )
              )}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                {[...apiResponses.userInfo.fields, ...apiResponses.addressInfo.fields, ...apiResponses.paymentInfo.fields].map(
                  (field) => (
                    <td key={field.name}>{row[field.name] || ""}</td>
                  )
                )}
                <td>
                  <button onClick={() => handleEdit(index)}>Edit</button>
                  <button onClick={() => handleDelete(index)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup */}
      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "#fff",
            border: "1px solid #ccc",
            padding: "20px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
            width: "90%",
            maxWidth: "400px",
          }}
        >
          <p>Please fill the next form to complete your submission.</p>
          <button
            onClick={closePopup}
            style={{
              padding: "10px",
              marginTop: "10px",
              width: "100%",
              backgroundColor: "#4CAF50",
              color: "white",
            }}
          >
            OK
          </button>
        </div>
      )}
    </div>
  );
};

export default DynamicForm;
