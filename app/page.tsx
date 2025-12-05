// export default function HomePage() {
//   return (
//     <>
//       {/* HERO */}
//       <section className="hero">
//         <div className="container">
//           <p className="hero-kicker">Saharanpur craft · Global projects</p>
//           <h1 className="hero-title">
//             Handcrafted wood decor for cafes, offices, and homes.
//           </h1>
//           <p className="hero-subtitle">
//             vrikshcrafts curates small and mid-sized wooden decor pieces from
//             trusted Saharanpur workshops and delivers them to businesses with
//             consistent quality, realistic timelines, and clear communication.
//           </p>

//           <div className="hero-actions">
//             <a href="/contact" className="primary-btn">
//               Start a project enquiry
//             </a>
//             <a href="/catalog" className="secondary-link">
//               View catalog overview
//             </a>
//           </div>

//           <div className="hero-grid">
//             <div>
//               <p className="info-card-title">B2B focused</p>
//               <p>Cafes, offices, interior designers, and decor / gift stores.</p>
//             </div>
//             <div>
//               <p className="info-card-title">Curated workshops</p>
//               <p>Selected Saharanpur units with consistent finishing and QC.</p>
//             </div>
//             <div>
//               <p className="info-card-title">Made-to-order</p>
//               <p>
//                 Sizes, finishes, and quantities aligned with your project plan.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* WHAT IS VRIKSHCRAFTS */}
//       <section
//         style={{
//           backgroundColor: "var(--bg-main)",
//           padding: "2rem 0",
//           borderTop: "1px solid var(--border-soft)",
//           borderBottom: "1px solid var(--border-soft)",
//         }}
//       >
//         <div className="container">
//           <h2
//             style={{
//               fontSize: "1.3rem",
//               fontWeight: 600,
//               color: "var(--text-main)",
//               marginTop: 0,
//               marginBottom: "0.75rem",
//             }}
//           >
//             What is vrikshcrafts?
//           </h2>

//           <div
//             style={{
//               background:
//                 "radial-gradient(circle at top left, #f4e4d1 0, #e5c9a6 70%)",
//               borderRadius: "var(--radius-card)",
//               border: "1px solid var(--border-soft)",
//               padding: "1rem 1.2rem",
//               boxShadow: "var(--shadow-soft)",
//               fontSize: "0.95rem",
//               color: "var(--text-muted)",
//               maxWidth: "46rem",
//             }}
//           >
//             <p style={{ margin: 0 }}>
//               vrikshcrafts is a Saharanpur-based wood decor partner focused on
//               B2B requirements. Instead of listing thousands of products, we
//               listen to your project, shortlist suitable handcrafted pieces from
//               trusted workshops, and coordinate production so that you can focus
//               on design and operations.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* WHO WE WORK WITH */}
//       <section
//         style={{
//           backgroundColor: "var(--bg-main)",
//           padding: "2rem 0",
//           borderBottom: "1px solid var(--border-soft)",
//         }}
//       >
//         <div className="container">
//           <h2
//             style={{
//               fontSize: "1.2rem",
//               fontWeight: 600,
//               color: "var(--text-main)",
//               marginTop: 0,
//               marginBottom: "0.75rem",
//             }}
//           >
//             Who we work with
//           </h2>

//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
//               gap: "1rem",
//               fontSize: "0.9rem",
//             }}
//           >
//             {/* Card 1 */}
//             <div
//               style={{
//                 background:
//                   "radial-gradient(circle at top left, #4a2a15 0, #2b1609 70%)",
//                 borderRadius: "var(--radius-card)",
//                 border: "1px solid rgba(248, 250, 252, 0.12)",
//                 padding: "1rem",
//                 boxShadow: "var(--shadow-soft)",
//                 color: "#fef3c7",
//                 transform: "translateY(0)",
//                 transition:
//                   "transform 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease, border-color 0.18s ease",
//               }}
//               className="home-who-card"
//             >
//               <p
//                 style={{
//                   fontWeight: 600,
//                   color: "#fed7aa",
//                   marginBottom: "0.35rem",
//                 }}
//               >
//                 Cafes & restaurants
//               </p>
//               <p>
//                 Warm, handcrafted elements for feature walls, counters, and
//                 seating areas without overloading the space.
//               </p>
//             </div>

//             {/* Card 2 */}
//             <div
//               style={{
//                 background:
//                   "radial-gradient(circle at top left, #4a2a15 0, #2b1609 70%)",
//                 borderRadius: "var(--radius-card)",
//                 border: "1px solid rgba(248, 250, 252, 0.12)",
//                 padding: "1rem",
//                 boxShadow: "var(--shadow-soft)",
//                 color: "#fef3c7",
//                 transform: "translateY(0)",
//                 transition:
//                   "transform 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease, border-color 0.18s ease",
//               }}
//               className="home-who-card"
//             >
//               <p
//                 style={{
//                   fontWeight: 600,
//                   color: "#fed7aa",
//                   marginBottom: "0.35rem",
//                 }}
//               >
//                 Offices & studios
//               </p>
//               <p>
//                 Subtle decor for reception, meeting rooms, and work areas that
//                 matches your brand tone.
//               </p>
//             </div>

//             {/* Card 3 */}
//             <div
//               style={{
//                 background:
//                   "radial-gradient(circle at top left, #4a2a15 0, #2b1609 70%)",
//                 borderRadius: "var(--radius-card)",
//                 border: "1px solid rgba(248, 250, 252, 0.12)",
//                 padding: "1rem",
//                 boxShadow: "var(--shadow-soft)",
//                 color: "#fef3c7",
//                 transform: "translateY(0)",
//                 transition:
//                   "transform 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease, border-color 0.18s ease",
//               }}
//               className="home-who-card"
//             >
//               <p
//                 style={{
//                   fontWeight: 600,
//                   color: "#fed7aa",
//                   marginBottom: "0.35rem",
//                 }}
//               >
//                 Interior designers
//               </p>
//               <p>
//                 Reliable sourcing for wood decor pieces based on your
//                 moodboards, with repeatability across projects.
//               </p>
//             </div>

//             {/* Card 4 */}
//             <div
//               style={{
//                 background:
//                   "radial-gradient(circle at top left, #4a2a15 0, #2b1609 70%)",
//                 borderRadius: "var(--radius-card)",
//                 border: "1px solid rgba(248, 250, 252, 0.12)",
//                 padding: "1rem",
//                 boxShadow: "var(--shadow-soft)",
//                 color: "#fef3c7",
//                 transform: "translateY(0)",
//                 transition:
//                   "transform 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease, border-color 0.18s ease",
//               }}
//               className="home-who-card"
//             >
//               <p
//                 style={{
//                   fontWeight: 600,
//                   color: "#fed7aa",
//                   marginBottom: "0.35rem",
//                 }}
//               >
//                 Decor & gift stores
//               </p>
//               <p>
//                 Small and mid-sized items that can be reordered as per demand,
//                 suitable for display and gifting.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* WHY BUSINESSES TRUST VRIKSHCRAFTS */}
//       <section
//         style={{
//           backgroundColor: "var(--bg-main)",
//           padding: "2rem 0 2.4rem",
//           borderBottom: "1px solid var(--border-soft)",
//         }}
//       >
//         <div className="container">
//           <h2
//             style={{
//               fontSize: "1.15rem",
//               fontWeight: 600,
//               color: "var(--text-main)",
//               marginTop: 0,
//               marginBottom: "0.75rem",
//             }}
//           >
//             Why businesses trust vrikshcrafts
//           </h2>
//           <p
//             style={{
//               fontSize: "0.9rem",
//               color: "var(--text-muted)",
//               maxWidth: "40rem",
//               marginTop: 0,
//               marginBottom: "1.1rem",
//             }}
//           >
//             A focused B2B approach, Saharanpur sourcing, and clear
//             communication so your decor plan moves smoothly from idea to
//             installation.
//           </p>

//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
//               gap: "1rem",
//               fontSize: "0.85rem",
//             }}
//           >
//             <div className="trust-card">
//               <p
//                 style={{
//                   fontWeight: 600,
//                   color: "#fed7aa",
//                   marginBottom: "0.3rem",
//                 }}
//               >
//                 Saharanpur-sourced workshops
//               </p>
//               <p style={{ margin: 0 }}>
//                 We work with a small set of workshops so finishing, carving
//                 style, and quality stay consistent across orders.
//               </p>
//             </div>

//             <div className="trust-card">
//               <p
//                 style={{
//                   fontWeight: 600,
//                   color: "#fed7aa",
//                   marginBottom: "0.3rem",
//                 }}
//               >
//                 Built for B2B timelines
//               </p>
//               <p style={{ margin: 0 }}>
//                 We keep quantities, lead times, and packing in mind so orders
//                 fit into real project schedules.
//               </p>
//             </div>

//             <div className="trust-card">
//               <p
//                 style={{
//                   fontWeight: 600,
//                   color: "#fed7aa",
//                   marginBottom: "0.3rem",
//                 }}
//               >
//                 Clear communication
//               </p>
//               <p style={{ margin: 0 }}>
//                 You get realistic suggestions, not over-promises—so there is
//                 less stress near handover.
//               </p>
//             </div>

//             <div className="trust-card">
//               <p
//                 style={{
//                   fontWeight: 600,
//                   color: "#fed7aa",
//                   marginBottom: "0.3rem",
//                 }}
//               >
//                 Flexible with designers
//               </p>
//               <p style={{ margin: 0 }}>
//                 You can send moodboards or drawings; we map them to practical
//                 Saharanpur-made pieces that match your concept.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* HOW THE PROCESS WORKS */}
//       <section
//         style={{
//           backgroundColor: "var(--bg-main)",
//           padding: "2rem 0 2.3rem",
//           borderBottom: "1px solid var(--border-soft)",
//         }}
//       >
//         <div className="container">
//           <h2
//             style={{
//               fontSize: "1.2rem",
//               fontWeight: 600,
//               color: "var(--text-main)",
//               marginTop: 0,
//               marginBottom: "0.75rem",
//             }}
//           >
//             How the process works
//           </h2>

//           <div
//             style={{
//               background:
//                 "radial-gradient(circle at top left, #f4e4d1 0, #e5c9a6 70%)",
//               borderRadius: "var(--radius-card)",
//               border: "1px solid var(--border-soft)",
//               padding: "1rem 1.2rem",
//               boxShadow: "var(--shadow-soft)",
//               fontSize: "0.9rem",
//               color: "var(--text-muted)",
//             }}
//           >
//             <ol
//               style={{
//                 margin: 0,
//                 paddingLeft: "1.1rem",
//               }}
//             >
//               <li style={{ marginBottom: "0.55rem" }}>
//                 You share your project details on the{" "}
//                 <a
//                   href="/contact"
//                   style={{ color: "var(--accent)", fontWeight: 600 }}
//                 >
//                   enquiry page
//                 </a>{" "}
//                 — type of space, mood, and basic budget.
//               </li>
//               <li style={{ marginBottom: "0.55rem" }}>
//                 vrikshcrafts reviews the requirements and suggests suitable
//                 categories and example pieces.
//               </li>
//               <li style={{ marginBottom: "0.55rem" }}>
//                 Once we align on direction, we coordinate with Saharanpur
//                 workshops for samples, pricing, and timelines.
//               </li>
//               <li>
//                 You receive a clear plan for decor pieces that fit your concept,
//                 along with realistic delivery timelines.
//               </li>
//             </ol>
//           </div>
//         </div>
//       </section>

//       {/* FAQ SECTION */}
//       <section
//         style={{
//           backgroundColor: "var(--bg-main)",
//           padding: "2rem 0 2.4rem",
//           borderBottom: "1px solid var(--border-soft)",
//         }}
//       >
//         <div className="container">
//           <h2
//             style={{
//               fontSize: "1.15rem",
//               fontWeight: 600,
//               color: "var(--text-main)",
//               marginTop: 0,
//               marginBottom: "0.75rem",
//             }}
//           >
//             Frequently asked questions
//           </h2>
//           <p
//             style={{
//               fontSize: "0.9rem",
//               color: "var(--text-muted)",
//               maxWidth: "40rem",
//               marginTop: 0,
//               marginBottom: "1.1rem",
//             }}
//           >
//             A quick overview of how vrikshcrafts typically works with cafés, offices,
//             designers, and decor stores. You can always share more details on the enquiry page.
//           </p>

//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
//               gap: "1rem",
//               fontSize: "0.85rem",
//             }}
//           >
//             <article className="catalog-card">
//               <p
//                 style={{
//                   fontWeight: 600,
//                   color: "#fed7aa",
//                   marginBottom: "0.35rem",
//                 }}
//               >
//                 Do you only work with businesses?
//               </p>
//               <p style={{ color: "#fef3c7", margin: 0 }}>
//                 Our main focus is B2B – cafés, offices, studios, and stores. For
//                 individual buyers, we usually take up projects where there is a
//                 clear decor plan or multiple pieces needed.
//               </p>
//             </article>

//             <article className="catalog-card">
//               <p
//                 style={{
//                   fontWeight: 600,
//                   color: "#fed7aa",
//                   marginBottom: "0.35rem",
//                 }}
//               >
//                 Is there a minimum order size?
//               </p>
//               <p style={{ color: "#fef3c7", margin: 0 }}>
//                 There is no strict minimum, but most projects become practical
//                 when there are several pieces or a clear budget range. You can
//                 mention your approximate budget in the enquiry form.
//               </p>
//             </article>

//             <article className="catalog-card">
//               <p
//                 style={{
//                   fontWeight: 600,
//                   color: "#fed7aa",
//                   marginBottom: "0.35rem",
//                 }}
//               >
//                 Do you ship outside Saharanpur?
//               </p>
//               <p style={{ color: "#fef3c7", margin: 0 }}>
//                 Yes. We work with clients across India and can discuss packing
//                 and shipping options based on your location and project scale.
//               </p>
//             </article>

//             <article className="catalog-card">
//               <p
//                 style={{
//                   fontWeight: 600,
//                   color: "#fed7aa",
//                   marginBottom: "0.35rem",
//                 }}
//               >
//                 Can you match my brand or interior theme?
//               </p>
//               <p style={{ color: "#fef3c7", margin: 0 }}>
//                 That is the main goal. If you share moodboards, photos, or a
//                 simple brief, we curate wood pieces and finishes that stay close
//                 to your existing brand or interior concept.
//               </p>
//             </article>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }





export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="container">
          <p className="hero-kicker">Saharanpur craft · Global projects</p>
          <h1 className="hero-title">
            Handcrafted wood decor for cafes, offices, and homes.
          </h1>

          <p className="hero-subtitle" style={{ maxWidth: "34rem" }}>
            vrikshcrafts curates small and mid-sized wooden decor pieces from
            trusted Saharanpur workshops and delivers them to businesses with
            consistent quality, realistic timelines, and clear communication.
          </p>


          <div className="hero-actions">
            <a href="/contact" className="primary-btn">
              Start a project enquiry
            </a>
            <a href="/catalog" className="secondary-link">
              View catalog overview
            </a>
          </div>

          <div className="hero-grid">
            <div>
              <p className="info-card-title">B2B focused</p>
              <p>Cafes, offices, interior designers, and decor / gift stores.</p>
            </div>
            <div>
              <p className="info-card-title">Curated workshops</p>
              <p>Selected Saharanpur units with consistent finishing and QC.</p>
            </div>
            <div>
              <p className="info-card-title">Made-to-order</p>
              <p>
                Sizes, finishes, and quantities aligned with your project plan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT IS VRIKSHCRAFTS */}
      <section
        style={{
          backgroundColor: "var(--bg-main)",
          padding: "2rem 0",
          borderTop: "1px solid var(--border-soft)",
          borderBottom: "1px solid var(--border-soft)",
        }}
      >
        <div className="container">
          {/* <h2
            style={{
              fontSize: "1.3rem",
              fontWeight: 600,
              color: "var(--text-main)",
              marginTop: 0,
              marginBottom: "0.75rem",
            }}
          >
            What is vrikshcrafts?
          </h2> */}
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 650,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "var(--text-main)",
              marginTop: 0,
              marginBottom: "0.85rem",
            }}
          >
            What is vrikshcrafts?
          </h2>

          <div
            style={{
              background:
                "radial-gradient(circle at top left, #f4e4d1 0, #e5c9a6 70%)",
              borderRadius: "var(--radius-card)",
              border: "1px solid var(--border-soft)",
              padding: "1rem 1.2rem",
              boxShadow: "var(--shadow-soft)",
              fontSize: "0.95rem",
              color: "var(--text-muted)",
              maxWidth: "46rem",
            }}
          >
            <p style={{ margin: 0 }}>
              vrikshcrafts is a Saharanpur-based wood decor partner focused on
              B2B requirements. Instead of listing thousands of products, we
              listen to your project, shortlist suitable handcrafted pieces from
              trusted workshops, and coordinate production so that you can focus
              on design and operations.
            </p>
          </div>
        </div>
      </section>

      {/* WHO WE WORK WITH */}
      <section
        style={{
          backgroundColor: "var(--bg-main)",
          padding: "2rem 0",
          borderBottom: "1px solid var(--border-soft)",
        }}
      >
        <div className="container">
          {/* <h2
            style={{
              fontSize: "1.2rem",
              fontWeight: 600,
              color: "var(--text-main)",
              marginTop: 0,
              marginBottom: "0.75rem",
            }}
          >
            Who we work with
          </h2> */}
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 650,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "var(--text-main)",
              marginTop: 0,
              marginBottom: "0.85rem",
            }}
          >
             Who we work with
          </h2>


          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1rem",
              fontSize: "0.9rem",
            }}
          >
            {/* Card 1 */}
            <div
              style={{
                background:
                  "radial-gradient(circle at top left, #4a2a15 0, #2b1609 70%)",
                borderRadius: "var(--radius-card)",
                border: "1px solid rgba(248, 250, 252, 0.12)",
                padding: "1rem",
                boxShadow: "var(--shadow-soft)",
                color: "#fef3c7",
              }}
              className="home-who-card"
            >
              <p
                style={{
                  fontWeight: 600,
                  color: "#fed7aa",
                  marginBottom: "0.35rem",
                }}
              >
                Cafes & restaurants
              </p>
              <p>
                Warm, handcrafted elements for feature walls, counters, and
                seating areas without overloading the space.
              </p>
            </div>

            {/* Card 2 */}
            <div
              style={{
                background:
                  "radial-gradient(circle at top left, #4a2a15 0, #2b1609 70%)",
                borderRadius: "var(--radius-card)",
                border: "1px solid rgba(248, 250, 252, 0.12)",
                padding: "1rem",
                boxShadow: "var(--shadow-soft)",
                color: "#fef3c7",
              }}
              className="home-who-card"
            >
              <p
                style={{
                  fontWeight: 600,
                  color: "#fed7aa",
                  marginBottom: "0.35rem",
                }}
              >
                Offices & studios
              </p>
              <p>
                Subtle decor for reception, meeting rooms, and work areas that
                matches your brand tone.
              </p>
            </div>

            {/* Card 3 */}
            <div
              style={{
                background:
                  "radial-gradient(circle at top left, #4a2a15 0, #2b1609 70%)",
                borderRadius: "var(--radius-card)",
                border: "1px solid rgba(248, 250, 252, 0.12)",
                padding: "1rem",
                boxShadow: "var(--shadow-soft)",
                color: "#fef3c7",
              }}
              className="home-who-card"
            >
              <p
                style={{
                  fontWeight: 600,
                  color: "#fed7aa",
                  marginBottom: "0.35rem",
                }}
              >
                Interior designers
              </p>
              <p>
                Reliable sourcing for wood decor pieces based on your
                moodboards, with repeatability across projects.
              </p>
            </div>

            {/* Card 4 */}
            <div
              style={{
                background:
                  "radial-gradient(circle at top left, #4a2a15 0, #2b1609 70%)",
                borderRadius: "var(--radius-card)",
                border: "1px solid rgba(248, 250, 252, 0.12)",
                padding: "1rem",
                boxShadow: "var(--shadow-soft)",
                color: "#fef3c7",
              }}
              className="home-who-card"
            >
              <p
                style={{
                  fontWeight: 600,
                  color: "#fed7aa",
                  marginBottom: "0.35rem",
                }}
              >
                Decor & gift stores
              </p>
              <p>
                Small and mid-sized items that can be reordered as per demand,
                suitable for display and gifting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW THE PROCESS WORKS
      <section
        style={{
          backgroundColor: "var(--bg-main)",
          padding: "2rem 0 2.3rem",
          borderBottom: "1px solid var(--border-soft)",
        }}
      >
        <div className="container">
          <h2
            style={{
              fontSize: "1.2rem",
              fontWeight: 600,
              color: "var(--text-main)",
              marginTop: 0,
              marginBottom: "0.75rem",
            }}
          >
            How the process works
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
              color: "var(--text-muted)",
            }}
          >
            <ol
              style={{
                margin: 0,
                paddingLeft: "1.1rem",
              }}
            >
              <li style={{ marginBottom: "0.55rem" }}>
                You share your project details on the{" "}
                <a
                  href="/contact"
                  style={{ color: "var(--accent)", fontWeight: 600 }}
                >
                  enquiry page
                </a>{" "}
                — type of space, mood, and basic budget.
              </li>
              <li style={{ marginBottom: "0.55rem" }}>
                vrikshcrafts reviews the requirements and suggests suitable
                categories and example pieces.
              </li>
              <li style={{ marginBottom: "0.55rem" }}>
                Once we align on direction, we coordinate with Saharanpur
                workshops for samples, pricing, and timelines.
              </li>
              <li>
                You receive a clear plan for decor pieces that fit your concept,
                along with realistic delivery timelines.
              </li>
            </ol>
          </div>
        </div>
      </section> */}

      {/* WHY BUSINESSES TRUST VRIKSHCRAFTS */}
      <section
        style={{
          backgroundColor: "var(--bg-main)",
          padding: "2rem 0 2.4rem",
          borderBottom: "1px solid var(--border-soft)",
        }}
      >
        <div className="container">
          {/* <h2
            style={{
              fontSize: "1.15rem",
              fontWeight: 600,
              color: "var(--text-main)",
              marginTop: 0,
              marginBottom: "0.75rem",
            }}
          >
            Why businesses trust vrikshcrafts
          </h2> */}
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 650,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "var(--text-main)",
              marginTop: 0,
              marginBottom: "0.85rem",
            }}
          >
            Why businesses trust vrikshcrafts
          </h2>

          <p
            style={{
              fontSize: "0.9rem",
              color: "var(--text-muted)",
              maxWidth: "40rem",
              marginTop: 0,
              marginBottom: "1.1rem",
            }}
          >
            A focused B2B approach, Saharanpur sourcing, and clear
            communication so your decor plan moves smoothly from idea to
            installation.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
              gap: "1rem",
              fontSize: "0.85rem",
            }}
          >
            <div
              className="trust-card"
              style={{
                background:
                  "radial-gradient(circle at top left, #4a2a15 0, #2b1609 70%)",
                borderRadius: "var(--radius-card)",
                border: "1px solid rgba(248, 250, 252, 0.12)",
                padding: "0.9rem 1rem",
                boxShadow: "var(--shadow-soft)",
                color: "#fef3c7",
              }}
            >
              <p
                style={{
                  fontWeight: 600,
                  color: "#fed7aa",
                  marginBottom: "0.3rem",
                }}
              >
                Saharanpur-sourced workshops
              </p>
              <p style={{ margin: 0 }}>
                We work with a small set of workshops so finishing, carving
                style, and quality stay consistent across orders.
              </p>
            </div>

            <div
              className="trust-card"
              style={{
                background:
                  "radial-gradient(circle at top left, #4a2a15 0, #2b1609 70%)",
                borderRadius: "var(--radius-card)",
                border: "1px solid rgba(248, 250, 252, 0.12)",
                padding: "0.9rem 1rem",
                boxShadow: "var(--shadow-soft)",
                color: "#fef3c7",
              }}
            >
              <p
                style={{
                  fontWeight: 600,
                  color: "#fed7aa",
                  marginBottom: "0.3rem",
                }}
              >
                Built for B2B timelines
              </p>
              <p style={{ margin: 0 }}>
                We keep quantities, lead times, and packing in mind so orders
                fit into real project schedules.
              </p>
            </div>

            <div
              className="trust-card"
              style={{
                background:
                  "radial-gradient(circle at top left, #4a2a15 0, #2b1609 70%)",
                borderRadius: "var(--radius-card)",
                border: "1px solid rgba(248, 250, 252, 0.12)",
                padding: "0.9rem 1rem",
                boxShadow: "var(--shadow-soft)",
                color: "#fef3c7",
              }}
            >
              <p
                style={{
                  fontWeight: 600,
                  color: "#fed7aa",
                  marginBottom: "0.3rem",
                }}
              >
                Clear communication
              </p>
              <p style={{ margin: 0 }}>
                You get realistic suggestions, not over-promises—so there is
                less stress near handover.
              </p>
            </div>

            <div
              className="trust-card"
              style={{
                background:
                  "radial-gradient(circle at top left, #4a2a15 0, #2b1609 70%)",
                borderRadius: "var(--radius-card)",
                border: "1px solid rgba(248, 250, 252, 0.12)",
                padding: "0.9rem 1rem",
                boxShadow: "var(--shadow-soft)",
                color: "#fef3c7",
              }}
            >
              <p
                style={{
                  fontWeight: 600,
                  color: "#fed7aa",
                  marginBottom: "0.3rem",
                }}
              >
                Flexible with designers
              </p>
              <p style={{ margin: 0 }}>
                You can send moodboards or drawings; we map them to practical
                Saharanpur-made pieces that match your concept.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* HOW THE PROCESS WORKS */}
      <section
        style={{
          backgroundColor: "var(--bg-main)",
          padding: "2rem 0 2.3rem",
          borderBottom: "1px solid var(--border-soft)",
        }}
      >
        <div className="container">
          {/* <h2
            style={{
              fontSize: "1.2rem",
              fontWeight: 600,
              color: "var(--text-main)",
              marginTop: 0,
              marginBottom: "0.75rem",
            }}
          >
            How the process works
          </h2> */}
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 650,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "var(--text-main)",
              marginTop: 0,
              marginBottom: "0.85rem",
            }}
          >
            How the process works
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
              color: "var(--text-muted)",
            }}
          >
            <ol
              style={{
                margin: 0,
                paddingLeft: "1.1rem",
              }}
            >
              <li style={{ marginBottom: "0.55rem" }}>
                You share your project details on the{" "}
                <a
                  href="/contact"
                  style={{ color: "var(--accent)", fontWeight: 600 }}
                >
                  enquiry page
                </a>{" "}
                — type of space, mood, and basic budget.
              </li>
              <li style={{ marginBottom: "0.55rem" }}>
                vrikshcrafts reviews the requirements and suggests suitable
                categories and example pieces.
              </li>
              <li style={{ marginBottom: "0.55rem" }}>
                Once we align on direction, we coordinate with Saharanpur
                workshops for samples, pricing, and timelines.
              </li>
              <li>
                You receive a clear plan for decor pieces that fit your concept,
                along with realistic delivery timelines.
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section
        style={{
          background:
            "radial-gradient(circle at top left, #4a2a15 0, #2b1609 70%)",
          padding: "1.8rem 0 2rem",
          borderTop: "1px solid rgba(248, 250, 252, 0.12)",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "0.8rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.18em",
                  color: "#facc15",
                  margin: 0,
                }}
              >
                Ready when you are
              </p>
              <h2
                style={{
                  marginTop: "0.4rem",
                  marginBottom: "0.25rem",
                  fontSize: "1.2rem",
                  fontWeight: 600,
                  color: "#fef3c7",
                }}
              >
                Share your next café, office, or store brief.
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.9rem",
                  color: "#fde68a",
                  maxWidth: "30rem",
                }}
              >
                A short enquiry is enough to start. We respond with practical
                Saharanpur-made options and realistic timelines.
              </p>
            </div>

            <div>
              <a href="/contact" className="primary-btn">
                Start a project enquiry
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
