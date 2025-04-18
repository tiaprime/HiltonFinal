//----------------// src/components/EntertainerInfoPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Entertainer } from "../types/Entertainer";

const EntertainerInfoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [ent, setEnt] = useState<Entertainer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Entertainer | null>(null);
  const navigate = useNavigate();

  // load entertainer
  useEffect(() => {
    if (!id) return;
    fetch(
      `https://hiltonfinalbackend-f9fthsb5dkh4e7gh.eastus-01.azurewebsites.net/Data/EntertainerInfo/${id}`
    )
      .then((r) => {
        if (!r.ok) throw new Error(`Error ${r.status}`);
        return r.json();
      })
      .then((data: Entertainer) => {
        setEnt(data);
        setForm(data); // initialize form
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  // handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!form) return;
    const { name, value } = e.target;
    setForm({ ...form, [name]: value } as Entertainer);
  };

  // cancel editing
  const handleCancel = () => {
    setForm(ent); // reset to last saved
    setEditing(false);
    setError(null);
  };

  // save edited data
  const handleSave = async () => {
    if (!form) return;
    const payload = {
      EntertainerID: form.entertainerID,
      EntStageName: form.entStageName,
      EntSSN: form.entSSN,
      EntStreetAddress: form.entStreetAddress,
      EntCity: form.entCity,
      EntState: form.entState,
      EntZipCode: form.entZipCode,
      EntPhoneNumber: form.entPhoneNumber,
      EntWebPage: form.entWebPage,
      EntEMailAddress: form.entEMailAddress,
      DateEntered: form.dateEntered,
    };
    try {
      const res = await fetch(
        `https://hiltonfinalbackend-f9fthsb5dkh4e7gh.eastus-01.azurewebsites.net/Data/EditEntertainer/${form.entertainerID}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error(`Save failed: ${res.status}`);
      // reflect updates in view
      setEnt(form);
      setEditing(false);
    } catch (e: any) {
      setError(e.message);
    }
  };

  //EXCEPTION HANDLING
  if (loading) return <p>Loading…</p>;
  if (error) return <p className="text-danger">Error: {error}</p>;
  if (!ent || !form) return <p>Not found.</p>;

  return (
    <div className="container mt-4">
      {!editing && (
        <button className="btn btn-warning me-2" onClick={() => navigate(-1)}>
          &larr; Back
        </button>
      )}

      {!editing ? (
        <>
          <h2 className="mb-3">{ent.entStageName}</h2>

          <table className="table table-bordered">
            <tbody>
              <tr>
                <th>ID</th>
                <td>{ent.entertainerID}</td>
              </tr>
              <tr>
                <th>Stage Name</th>
                <td>{ent.entStageName}</td>
              </tr>
              <tr>
                <th>SSN</th>
                <td>{ent.entSSN}</td>
              </tr>
              <tr>
                <th>Street Address</th>
                <td>{ent.entStreetAddress}</td>
              </tr>
              <tr>
                <th>City</th>
                <td>{ent.entCity}</td>
              </tr>
              <tr>
                <th>State</th>
                <td>{ent.entState}</td>
              </tr>
              <tr>
                <th>Zip Code</th>
                <td>{ent.entZipCode}</td>
              </tr>
              <tr>
                <th>Phone Number</th>
                <td>{ent.entPhoneNumber}</td>
              </tr>
              <tr>
                <th>Web Page</th>
                <td>
                  {ent.entWebPage ? (
                    <a
                      href={ent.entWebPage}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {ent.entWebPage}
                    </a>
                  ) : (
                    <em>—</em>
                  )}
                </td>
              </tr>
              <tr>
                <th>Email Address</th>
                <td>
                  {ent.entEMailAddress ? (
                    <a href={`mailto:${ent.entEMailAddress}`}>
                      {ent.entEMailAddress}
                    </a>
                  ) : (
                    <em>—</em>
                  )}
                </td>
              </tr>
              <tr>
                <th>Date Entered</th>
                <td>{new Date(ent.dateEntered).toLocaleDateString()}</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-3">
            <button
              className="btn btn-warning me-2"
              onClick={() => setEditing(true)}
            >
              Edit
            </button>
            <button
              className="btn btn-danger"
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to delete this entertainer?"
                  )
                ) {
                  fetch(
                    `https://hiltonfinalbackend-f9fthsb5dkh4e7gh.eastus-01.azurewebsites.net/Data/DeleteEntertainer/${ent.entertainerID}`,
                    { method: "DELETE" }
                  ).then(() => navigate("/entertainerStats"));
                }
              }}
            >
              Delete
            </button>
          </div>
        </>
      ) : (
        // ─── Edit Form ───────────────────────────────────────────────
        <div className="card p-4">
          <h3>Edit {ent.entStageName}</h3>
          {error && <div className="alert alert-danger">{error}</div>}

          {[
            { label: "Stage Name", name: "entStageName", type: "text" },
            { label: "SSN", name: "entSSN", type: "text" },
            { label: "Street Address", name: "entStreetAddress", type: "text" },
            { label: "City", name: "entCity", type: "text" },
            { label: "State", name: "entState", type: "text" },
            { label: "Zip Code", name: "entZipCode", type: "text" },
            { label: "Phone Number", name: "entPhoneNumber", type: "tel" },
            { label: "Web Page", name: "entWebPage", type: "url" },
            { label: "Email Address", name: "entEmailAddress", type: "email" },
            { label: "Date Entered", name: "dateEntered", type: "date" },
          ].map((fld) => (
            <div className="mb-3" key={fld.name}>
              <label className="form-label">{fld.label}</label>
              <input
                className="form-control"
                name={fld.name}
                type={fld.type}
                value={(form as any)[fld.name] ?? ""}
                onChange={handleChange}
              />
            </div>
          ))}

          {/* BUTTONS */}
          <button className="btn btn-success me-2" onClick={handleSave}>
            Save
          </button>
          <button className="btn btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default EntertainerInfoPage;
