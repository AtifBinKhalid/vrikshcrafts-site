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
    <>
      <section className="hero">
        <div className="container">
          <p className="hero-kicker">Contact · vrikshcrafts</p>
          <h1 className="hero-title">Tell us about your project</h1>
          <p className="hero-subtitle">
            Share a few basic details about your café, office, or interior
            project. vrikshcrafts will review your note and follow up using the
            email you provide.
          </p>

          {/* Small response time pill */}
          <div
            style={{
              marginTop: "0.9rem",
              padding: "0.5rem 0.75rem",
              borderRadius: "999px",
              backgroundColor: "var(--bg-subtle)",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              fontSize: "0.8rem",
              color: "var(--text-muted)",
              border: "1px solid rgba(22, 101, 52, 0.25)",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "8px",
                height: "8px",
                borderRadius: "999px",
                backgroundColor: "var(--accent-green)",
              }}
            />
            <span>We usually reply within 1–2 business days.</span>
          </div>

          {/* GLOBAL BANNERS ABOVE FORM */}
          {formState === "success" && (
            <div
              style={{
                marginTop: "1rem",
                marginBottom: "0.5rem",
              }}
            >
              <div
                style={{
                  padding: "0.6rem 0.75rem",
                  borderRadius: "12px",
                  backgroundColor: "#dcfce7",
                  border: "1px solid #15803d",
                  color: "#166534",
                  fontSize: "0.85rem",
                }}
              >
                Thank you. Your enquiry has been received. We will reach out
                using the email you provided.
              </div>
            </div>
          )}

          {formState === "error" && (
            <div
              style={{
                marginTop: "1rem",
                marginBottom: "0.5rem",
              }}
            >
              <div
                style={{
                  padding: "0.6rem 0.75rem",
                  borderRadius: "12px",
                  backgroundColor: "#fee2e2",
                  border: "1px solid #b91c1c",
                  color: "#991b1b",
                  fontSize: "0.85rem",
                }}
              >
                {errorMsg || "Something went wrong. Please try again."}
              </div>
            </div>
          )}

          <div
            className="contact-grid"
            style={{
              marginTop: "1.5rem",
            }}
          >
            {/* Left: form */}
            <form
              onSubmit={handleSubmit}
              style={{
                background:
                  "radial-gradient(circle at top left, #4a2a15 0, #2b1609 70%)",
                border: "1px solid rgba(248, 250, 252, 0.12)",
                borderRadius: "var(--radius-card)",
                padding: "1.1rem",
                fontSize: "0.9rem",
                boxShadow: "var(--shadow-soft)",
                color: "#fef3c7",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(180px, 1fr))",
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
                      backgroundColor: "var(--bg-card)",
                      border: "1px solid var(--border-soft)",
                      color: "var(--text-main)",
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
                      backgroundColor: "var(--bg-card)",
                      border: "1px solid var(--border-soft)",
                      color: "var(--text-main)",
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(180px, 1fr))",
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
                      backgroundColor: "var(--bg-card)",
                      border: "1px solid var(--border-soft)",
                      color: "var(--text-main)",
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
                      backgroundColor: "var(--bg-card)",
                      border: "1px solid var(--border-soft)",
                      color: "var(--text-main)",
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(180px, 1fr))",
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
                      backgroundColor: "var(--bg-card)",
                      border: "1px solid var(--border-soft)",
                      color: "var(--text-main)",
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
                      backgroundColor: "var(--bg-card)",
                      border: "1px solid var(--border-soft)",
                      color: "var(--text-main)",
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
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border-soft)",
                    color: "var(--text-main)",
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
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border-soft)",
                    color: "var(--text-main)",
                    resize: "vertical",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={formState === "submitting"}
                className="primary-btn"
                style={{
                  marginTop: "1rem",
                  paddingInline: "1.4rem",
                  paddingBlock: "0.55rem",
                  cursor:
                    formState === "submitting" ? "not-allowed" : "pointer",
                  opacity: formState === "submitting" ? 0.85 : 1,
                }}
              >
                {formState === "submitting" ? "Submitting..." : "Submit enquiry"}
              </button>
            </form>

            {/* Right: small info box */}
            <aside
              style={{
                background:
                  "radial-gradient(circle at top left, #f4e4d1 0, #e5c9a6 70%)",
                border: "1px dashed rgba(22, 101, 52, 0.35)",
                borderRadius: "var(--radius-card)",
                padding: "1rem",
                fontSize: "0.85rem",
                color: "var(--text-muted)",
                boxShadow: "var(--shadow-soft)",
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
                Links to reference photos, Pinterest boards, or a short
                description of the mood (minimal, rustic, traditional, etc.)
                help us suggest better options.
              </p>
              <p style={{ marginTop: "0.5rem" }}>
                You can also share floor plans or photos later by replying to
                our confirmation email.
              </p>
            </aside>
          </div>
        </div>
      </section>

      {/* HOW TO REACH US */}
      <section
        style={{
          backgroundColor: "var(--bg-main)",
          padding: "2rem 0 2.2rem",
          borderTop: "1px solid var(--border-soft)",
        }}
      >
        <div className="container">
          <h2
            className="section-title"
            style={{
              fontSize: "1.15rem",
              marginTop: 0,
              marginBottom: "0.75rem",
            }}
          >
            How to reach us
          </h2>

          <div
            style={{
              background:
                "radial-gradient(circle at top left, #f4e4d1 0, #e5c9a6 70%)",
              borderRadius: "var(--radius-card)",
              border: "1px solid var(--border-soft)",
              padding: "1rem 1.2rem",
              boxShadow: "var(--shadow-soft)",
              fontSize: "0.9rem",
              color: "var(--text-main)",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)",
                gap: "1.25rem",
              }}
            >
              {/* Left: direct contact details */}
              <div>
                <p
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    marginBottom: "0.4rem",
                    color: "var(--text-main)",
                  }}
                >
                  Direct contact
                </p>
                <p style={{ marginBottom: "0.35rem" }}>
                  <strong>Email:</strong>{" "}
                  <a
                    href="mailto:atifbinkhalid1@gmail.com"
                    style={{
                      color: "var(--accent)",
                      textDecoration: "none",
                      fontWeight: 600,
                    }}
                  >
                    atifbinkhalid1@gmail.com
                  </a>
                </p>
                <p style={{ marginBottom: "0.35rem" }}>
                  <strong>Phone / WhatsApp:</strong> +91-8218656007
                </p>
                <p style={{ marginBottom: "0.35rem" }}>
                  <strong>Based in:</strong> Saharanpur, India · working with
                  clients across India and global projects.
                </p>
                <p style={{ marginBottom: 0 }}>
                  <strong>Typical response time:</strong> within 1–2 business
                  days for project enquiries.
                </p>
              </div>

              {/* Right: when to use what */}
              <div>
                <p
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    marginBottom: "0.4rem",
                    color: "var(--text-main)",
                  }}
                >
                  How to use each option
                </p>
                <ul
                  style={{
                    paddingLeft: "1.1rem",
                    margin: 0,
                    listStyleType: "disc",
                    color: "var(--text-muted)",
                  }}
                >
                  <li style={{ marginBottom: "0.3rem" }}>
                    Use the <strong>enquiry form</strong> for new projects
                    (cafés, offices, stores, gifting) so we get all details in
                    one place.
                  </li>
                  <li style={{ marginBottom: "0.3rem" }}>
                    Use <strong>email</strong> when you want to share drawings,
                    moodboards, or reference photos.
                  </li>
                  <li>
                    Use <strong>phone / WhatsApp</strong> for quick
                    clarifications once a project is already in progress.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
