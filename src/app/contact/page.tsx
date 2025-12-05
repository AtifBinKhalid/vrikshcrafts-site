"use client";

import React, { FormEvent, useState } from "react";

type FormState = "idle" | "submitting" | "success" | "error";

export default function ContactPage() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: formData.get("name") as string,
      businessName: formData.get("businessName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      city: formData.get("city") as string,
      projectType: formData.get("projectType") as string,
      budget: formData.get("budget") as string,
      message: formData.get("message") as string,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to submit enquiry.");
      }

      setFormState("success");
      form.reset();
    } catch (err: any) {
      setFormState("error");
      setErrorMsg(err.message || "Something went wrong.");
    }
  }

  return (
    <section className="hero">
      <div className="container">
        <p className="hero-kicker">Enquiry</p>
        <h1 className="hero-title">Tell us about your project</h1>
        <p className="hero-subtitle">
          Share a few basic details about your café, office, or interior
          project. vrikshcrafts will review your note and follow up using the
          email you provide.
        </p>

        <div
          style={{
            marginTop: "1.5rem",
            display: "grid",
            gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)",
            gap: "1.5rem",
          }}
        >
          {/* Left: form */}
          <form
            onSubmit={handleSubmit}
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "1rem",
              fontSize: "0.9rem",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "0.75rem",
              }}
            >
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                  Your name*
                </label>
                <input
                  name="name"
                  required
                  style={{
                    width: "100%",
                    marginTop: "0.25rem",
                    padding: "0.45rem 0.5rem",
                    borderRadius: "6px",
                    border: "1px solid #cbd5f5",
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                  Business / brand name
                </label>
                <input
                  name="businessName"
                  style={{
                    width: "100%",
                    marginTop: "0.25rem",
                    padding: "0.45rem 0.5rem",
                    borderRadius: "6px",
                    border: "1px solid #cbd5f5",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "0.75rem",
                marginTop: "0.75rem",
              }}
            >
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                  Email*
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  style={{
                    width: "100%",
                    marginTop: "0.25rem",
                    padding: "0.45rem 0.5rem",
                    borderRadius: "6px",
                    border: "1px solid #cbd5f5",
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                  Phone (with country code)
                </label>
                <input
                  name="phone"
                  style={{
                    width: "100%",
                    marginTop: "0.25rem",
                    padding: "0.45rem 0.5rem",
                    borderRadius: "6px",
                    border: "1px solid #cbd5f5",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "0.75rem",
                marginTop: "0.75rem",
              }}
            >
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                  City
                </label>
                <input
                  name="city"
                  style={{
                    width: "100%",
                    marginTop: "0.25rem",
                    padding: "0.45rem 0.5rem",
                    borderRadius: "6px",
                    border: "1px solid #cbd5f5",
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                  Project type
                </label>
                <select
                  name="projectType"
                  defaultValue=""
                  style={{
                    width: "100%",
                    marginTop: "0.25rem",
                    padding: "0.45rem 0.5rem",
                    borderRadius: "6px",
                    border: "1px solid #cbd5f5",
                  }}
                >
                  <option value="" disabled>
                    Select
                  </option>
                  <option value="Cafe">Cafe / restaurant</option>
                  <option value="Office">Office / workspace</option>
                  <option value="Designer">Interior designer / studio</option>
                  <option value="Store">Decor / gift store</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: "0.75rem" }}>
              <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                Approximate decor budget (optional)
              </label>
              <input
                name="budget"
                placeholder="For example: ₹1–3 lakh, ₹3–5 lakh, etc."
                style={{
                  width: "100%",
                  marginTop: "0.25rem",
                  padding: "0.45rem 0.5rem",
                  borderRadius: "6px",
                  border: "1px solid #cbd5f5",
                }}
              />
            </div>

            <div style={{ marginTop: "0.75rem" }}>
              <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                Project details*
              </label>
              <textarea
                name="message"
                required
                rows={4}
                placeholder="Describe your space, theme, timelines, and any references."
                style={{
                  width: "100%",
                  marginTop: "0.25rem",
                  padding: "0.45rem 0.5rem",
                  borderRadius: "6px",
                  border: "1px solid #cbd5f5",
                  resize: "vertical",
                }}
              />
            </div>

            {formState === "error" && (
              <p style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "#b91c1c" }}>
                {errorMsg || "Something went wrong. Please try again."}
              </p>
            )}
            {formState === "success" && (
              <p
                style={{
                  marginTop: "0.5rem",
                  fontSize: "0.8rem",
                  color: "#15803d",
                }}
              >
                Thank you. Your enquiry has been received. We will reach out
                using the email you provided.
              </p>
            )}

            <button
              type="submit"
              disabled={formState === "submitting"}
              style={{
                marginTop: "1rem",
                padding: "0.5rem 1.25rem",
                borderRadius: "999px",
                border: "none",
                cursor: formState === "submitting" ? "not-allowed" : "pointer",
                backgroundColor:
                  formState === "submitting" ? "#fb923c" : "#92400e",
                color: "#fefce8",
                fontSize: "0.9rem",
                fontWeight: 600,
              }}
            >
              {formState === "submitting" ? "Submitting..." : "Submit enquiry"}
            </button>
          </form>

          {/* Right: small info box */}
          <aside
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "1rem",
              fontSize: "0.85rem",
              color: "#475569",
            }}
          >
            <h2
              style={{
                marginTop: 0,
                marginBottom: "0.5rem",
                fontSize: "0.95rem",
                fontWeight: 600,
                color: "#0f172a",
              }}
            >
              What helps us respond faster
            </h2>
            <p>
              Links to reference photos, Pinterest boards, or a short description
              of the mood (minimal, rustic, traditional, etc.) help us suggest
              better options.
            </p>
            <p style={{ marginTop: "0.5rem" }}>
              You can also share floor plans or photos later by replying to our
              confirmation email.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
