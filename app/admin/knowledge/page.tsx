import type { Metadata } from "next";
import KnowledgeStudio from "./KnowledgeStudio";

export const metadata: Metadata = {
  title: "Knowledge Studio · vrikshcrafts",
  description: "Private knowledge management for the vrikshcrafts assistant.",
  robots: { index: false, follow: false },
};

export default function KnowledgeStudioPage() {
  return <KnowledgeStudio />;
}
