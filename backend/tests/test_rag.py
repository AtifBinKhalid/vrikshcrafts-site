from __future__ import annotations

import unittest

from backend.app.chunking import chunk_knowledge_text
from backend.app.knowledge import load_core_knowledge
from backend.app.retrieval import retrieve_knowledge, tokenize


class RagTests(unittest.TestCase):
    def test_core_knowledge_loads(self) -> None:
        knowledge = load_core_knowledge()
        self.assertGreaterEqual(len(knowledge), 25)
        self.assertEqual(len({item["id"] for item in knowledge}), len(knowledge))
        self.assertTrue(any(item["id"] == "direct-contact" for item in knowledge))

    def test_heading_aware_chunking(self) -> None:
        chunks = chunk_knowledge_text(
            source_id="care-guide-test",
            title="Product care guide",
            source_url="/contact",
            keywords=["care", "cleaning"],
            text="# Cleaning\nUse a soft dry cloth for routine cleaning. Keep the approved finish away from harsh chemicals.\n\n# Storage\nStore finished pieces in a dry indoor area until installation. Confirm special handling with the team.",
            max_chunk_size=120,
        )
        self.assertEqual(len(chunks), 2)
        self.assertIn("Cleaning", chunks[0]["title"])
        self.assertIn("Storage", chunks[1]["title"])

    def test_retrieval_parity(self) -> None:
        self.assertEqual(retrieve_knowledge("What products do you offer?")[0]["id"], "catalog-overview")
        self.assertEqual(retrieve_knowledge("Do you ship across India?")[0]["id"], "shipping")
        self.assertEqual(retrieve_knowledge("Who founded vrikshcrafts?")[0]["id"], "founder")
        self.assertEqual(retrieve_knowledge("What is your WhatsApp number?")[0]["id"], "direct-contact")

    def test_hinglish_and_unrelated_queries(self) -> None:
        result = retrieve_knowledge("Kya aap lakdi ka custom saman banate ho?")[0]
        self.assertIn(result["id"], {"customization", "service-overview"})
        self.assertIn("wood", tokenize("lakdi"))
        self.assertEqual(retrieve_knowledge("Who won the football match yesterday?"), [])

    def test_persistent_source_is_searchable_without_duplicate_chunks(self) -> None:
        source = {
            "schemaVersion": 1,
            "id": "persistent-care-guide",
            "title": "Persistent care guide",
            "sourceUrl": "/contact",
            "keywords": ["beeswax", "care"],
            "originalFilename": "care.md",
            "createdAt": "2026-09-20T00:00:00Z",
            "updatedAt": "2026-09-20T00:00:00Z",
            "characterCount": 80,
            "chunks": [
                {
                    "id": "persistent-care-guide-1",
                    "title": "Beeswax care",
                    "url": "/contact",
                    "content": "Use a soft cloth when maintaining the approved beeswax finish.",
                    "keywords": ["beeswax", "care"],
                }
            ],
        }
        result = retrieve_knowledge(
            "How do I care for a beeswax finish?", additional_sources=[source, source]
        )
        self.assertEqual(result[0]["id"], "persistent-care-guide-1")
        self.assertEqual(
            len([item for item in result if item["id"] == "persistent-care-guide-1"]), 1
        )


if __name__ == "__main__":
    unittest.main()
