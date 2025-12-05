// "use client";

// import { useState } from "react";

// const FAQ_ITEMS = [
//   {
//     question: "Do you only work with cafés and restaurants?",
//     answer:
//       "No. vrikshcrafts also works with offices, studios, and decor / gift stores. The key point is that there is a clear project or use-case for the wooden pieces.",
//   },
//   {
//     question: "Do you have a ready-made online catalog with thousands of items?",
//     answer:
//       "We keep a focused set of example categories. For real projects, we shortlist and customise pieces based on your space, mood, and budget instead of pushing a generic, fixed catalog.",
//   },
//   {
//     question: "Can you ship outside Saharanpur or Uttar Pradesh?",
//     answer:
//       "Yes. Orders can be shipped across India. For international projects, we discuss packing, timelines, and logistics in more detail during the enquiry process.",
//   },
//   {
//     question: "Do you replace my interior designer or architect?",
//     answer:
//       "No. vrikshcrafts focuses on the wooden decor elements—signage, panels, tabletops, and small fixtures—and works alongside your design or contracting team.",
//   },
// ];

// export default function FAQSection() {
//   // START CLOSED: no question is open initially
//   const [openIndex, setOpenIndex] = useState<number | null>(null);

//   const toggleIndex = (index: number) => {
//     setOpenIndex((current) => (current === index ? null : index));
//   };

//   return (
//     <section
//       style={{
//         marginTop: "2.25rem",
//         paddingTop: "1.75rem",
//         borderTop: "1px solid var(--border-soft)",
//       }}
//     >
//       <h2
//         style={{
//           fontSize: "1.05rem",
//           fontWeight: 600,
//           color: "var(--text-main)",
//           marginTop: 0,
//           marginBottom: "0.75rem",
//         }}
//       >
//         Frequently asked questions
//       </h2>
//       <div
//         style={{
//           borderRadius: "var(--radius-card)",
//           border: "1px solid var(--border-soft)",
//           backgroundColor: "var(--bg-card)",
//           padding: "0.6rem 0.9rem",
//         }}
//       >
//         {FAQ_ITEMS.map((item, index) => {
//           const isOpen = openIndex === index;
//           return (
//             <div
//               key={item.question}
//               style={{
//                 borderBottom:
//                   index !== FAQ_ITEMS.length - 1
//                     ? "1px solid rgba(148, 120, 84, 0.3)"
//                     : "none",
//                 padding: "0.3rem 0",
//               }}
//             >
//               <button
//                 type="button"
//                 onClick={() => toggleIndex(index)}
//                 style={{
//                   width: "100%",
//                   textAlign: "left",
//                   padding: "0.4rem 0.1rem",
//                   border: "none",
//                   background: "transparent",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                   gap: "0.75rem",
//                   cursor: "pointer",
//                 }}
//                 aria-expanded={isOpen}
//               >
//                 <span
//                   style={{
//                     fontSize: "0.9rem",
//                     fontWeight: 600,
//                     color: "var(--text-main)",
//                   }}
//                 >
//                   {item.question}
//                 </span>
//                 <span
//                   style={{
//                     fontSize: "1.1rem",
//                     color: "var(--text-soft)",
//                   }}
//                 >
//                   {isOpen ? "–" : "+"}
//                 </span>
//               </button>

//               {isOpen && (
//                 <p
//                   style={{
//                     marginTop: "0.2rem",
//                     marginBottom: "0.45rem",
//                     fontSize: "0.85rem",
//                     color: "var(--text-muted)",
//                     paddingRight: "0.4rem",
//                   }}
//                 >
//                   {item.answer}
//                 </p>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </section>
//   );
// }





"use client";

import React, { useState } from "react";

const FAQ_ITEMS = [
  {
    question: "Do you only work with businesses?",
    answer:
      "vrikshcrafts is mainly focused on B2B work – cafés, offices, studios, and decor / gift stores. For individual buyers, we usually take projects where there is a clear decor plan or multiple pieces planned together.",
  },
  {
    question: "Is there a minimum budget or order size?",
    answer:
      "There is no fixed minimum order, but most projects become practical when there are several decor pieces or a clear budget range. On the enquiry form you can mention something simple like “around ₹1–3 lakh” or “small starting order” and we will guide you.",
  },
  {
    question: "Can you match our brand or interior theme?",
    answer:
      "Yes. If you share photos, moodboards, or a simple description of your brand tone, vrikshcrafts will shortlist wood styles, finishes, and pieces that stay close to your existing concept instead of random catalog items.",
  },
  {
    question: "Do you ship outside Saharanpur?",
    answer:
      "Yes. We work with clients across India. For each project we discuss packing, shipping options, and timelines based on your location and the size of the order.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      style={{
        backgroundColor: "var(--bg-main)",
        padding: "2rem 0 2.4rem",
        borderTop: "1px solid var(--border-soft)",
      }}
    >
      <div className="container">
        <h2
          style={{
            fontSize: "1.15rem",
            fontWeight: 600,
            color: "var(--text-main)",
            marginTop: 0,
            marginBottom: "0.75rem",
          }}
        >
          Frequently asked questions
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
          A quick overview of how vrikshcrafts usually works with cafés, offices,
          designers, and decor / gift stores. If you have a different kind of
          requirement, you can always share details on the enquiry page.
        </p>

        <div
          style={{
            display: "grid",
            gap: "0.75rem",
            maxWidth: "48rem",
          }}
        >
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={item.question}
                style={{
                  borderRadius: "var(--radius-card)",
                  border: "1px solid var(--border-soft)",
                  backgroundColor: "var(--bg-card)",
                  boxShadow: "var(--shadow-soft)",
                  overflow: "hidden",
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenIndex(isOpen ? null : idx)
                  }
                  style={{
                    all: "unset",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "0.75rem 0.9rem",
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: "var(--text-main)",
                    }}
                  >
                    {item.question}
                  </span>
                  <span
                    style={{
                      fontSize: "1.1rem",
                      lineHeight: 1,
                      color: "var(--text-soft)",
                    }}
                  >
                    {isOpen ? "–" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <div
                    style={{
                      padding: "0.7rem 0.9rem 0.85rem",
                      borderTop: "1px dashed var(--border-soft)",
                      fontSize: "0.85rem",
                      color: "var(--text-muted)",
                      backgroundColor: "var(--bg-subtle)",
                    }}
                  >
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
