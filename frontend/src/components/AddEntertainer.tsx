// src/components/AddEntertainerPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface NewEntertainer {
  entStageName: string;
  entSSN: string;
  entStreetAddress: string;
  entCity: string;
  entState: string;
  entZipCode: string;
  entPhoneNumber: string;
  entWebPage: string | null; // allow null
  entEmailAddress: string | null; // allow null
  dateEntered: string;
}

const AddEntertainer: React.FC = () => {
  const [form, setForm] = useState<NewEntertainer>({
    entStageName: "",
    entSSN: "",
    entStreetAddress: "",
    entCity: "",
    entState: "",
    entZipCode: "",
    entPhoneNumber: "",
    entWebPage: null,
    entEmailAddress: null,
    dateEntered: new Date().toISOString().split("T")[0],
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]:
        value === "" && (name === "entWebPage" || name === "entEmailAddress")
          ? null
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Ensure empty strings are converted to null
    const payload: NewEntertainer = {
      ...form,
      entWebPage: form.entWebPage === "" ? null : form.entWebPage,
      entEmailAddress:
        form.entEmailAddress === "" ? null : form.entEmailAddress,
    };

    try {
      const res = await fetch(
        "https://hiltonfinalbackend-f9fthsb5dkh4e7gh.eastus-01.azurewebsites.net/Data/AddEntertainer",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      navigate("/entertainerStats");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add Entertainer</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        {[
          {
            label: "Stage Name",
            name: "entStageName",
            type: "text",
            required: true,
          },
          { label: "SSN", name: "entSSN", type: "text", required: true },
          {
            label: "Street Address",
            name: "entStreetAddress",
            type: "text",
            required: true,
          },
          { label: "City", name: "entCity", type: "text", required: true },
          { label: "State", name: "entState", type: "text", required: true },
          {
            label: "Zip Code",
            name: "entZipCode",
            type: "text",
            required: true,
          },
          {
            label: "Phone Number",
            name: "entPhoneNumber",
            type: "tel",
            required: true,
          },
          {
            label: "Web Page",
            name: "entWebPage",
            type: "url",
            required: false,
          },
          {
            label: "Email Address",
            name: "entEmailAddress",
            type: "email",
            required: false,
          },
          {
            label: "Date Entered",
            name: "dateEntered",
            type: "date",
            required: true,
          },
        ].map((field) => (
          <div className="mb-3" key={field.name}>
            <label className="form-label">{field.label}</label>
            <input
              className="form-control"
              name={field.name}
              type={field.type}
              value={(form as any)[field.name] ?? ""}
              onChange={handleChange}
              required={field.required}
            />
          </div>
        ))}

        <button type="submit" className="btn btn-success">
          Add Entertainer
        </button>
      </form>
    </div>
  );
};

export default AddEntertainer;
