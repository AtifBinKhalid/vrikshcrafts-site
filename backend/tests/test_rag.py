from __future__ import annotations

import unittest

from backend.app.chunking import chunk_knowledge_text
from backend.app.answering import (
    build_retrieval_query,
    conversational_reply,
    local_answer,
    suggested_follow_ups,
)
from backend.app.knowledge import load_core_knowledge
from backend.app.retrieval import normalize_query_spelling, retrieve_knowledge, tokenize


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

    def test_short_follow_up_uses_recent_user_context(self) -> None:
        query = build_retrieval_query(
            "What about the timeline?",
            [
                {"role": "user", "content": "Can you make custom café wall panels?"},
                {"role": "assistant", "content": "Yes, subject to project confirmation."},
            ],
        )
        self.assertIn("custom café wall panels", query)
        self.assertIn("timeline", query)
        self.assertEqual(
            retrieve_knowledge(query, limit=1)[0]["id"], "timelines-availability"
        )
        answer = local_answer(
            "What about the timeline?",
            retrieve_knowledge(query, limit=5),
            "Ativ",
            retrieval_query=query,
        )
        self.assertIn("realistic schedule", answer)
        self.assertIn("lead-time", answer)

    def test_local_answer_is_concise_and_contextual(self) -> None:
        sources = retrieve_knowledge("What products do you offer?")
        answer = local_answer("What products do you offer?", sources, "Ativ")
        self.assertIn("vrikshcrafts", answer)
        self.assertNotIn("For project-specific pricing", answer)
        self.assertLess(len(answer), 1_000)
        self.assertTrue(suggested_follow_ups(sources))

    def test_local_answer_clarifies_unknown_questions(self) -> None:
        answer = local_answer("Can you repair my laptop?", [], "Ativ")
        self.assertIn("rather not guess", answer)
        self.assertIn("tell me a little more", answer)
        self.assertNotIn("knowledge base", answer)

    def test_local_answer_does_not_promise_exact_delivery(self) -> None:
        sources = retrieve_knowledge("Can you deliver 40 panels next Friday?", limit=5)
        answer = local_answer("Can you deliver 40 panels next Friday?", sources, "Ativ")
        self.assertTrue(answer.startswith("I’d rather not guess"))
        self.assertIn("team can confirm", answer)

    def test_local_answer_handles_conversation_naturally(self) -> None:
        self.assertIn("thanks for asking", local_answer("How are you?", [], "Ativ"))
        self.assertIn("glad that helped", local_answer("Thank you", [], "Ativ"))
        product_answer = local_answer(
            "What products do you offer?",
            retrieve_knowledge("What products do you offer?"),
            "Ativ",
        )
        self.assertTrue(product_answer.startswith("Here’s the short version"))
        price_answer = local_answer(
            "How much does it cost?",
            retrieve_knowledge("How much does it cost?", limit=5),
            "Ativ",
        )
        self.assertTrue(price_answer.startswith("Pricing is worked out project by project"))

    def test_dialogue_intents_are_handled_before_rag(self) -> None:
        identity_reply = conversational_reply("Hi do you know me", "Atif")
        self.assertIsNotNone(identity_reply)
        identity_answer, identity_suggestions = identity_reply or ("", [])
        self.assertIn("Atif", identity_answer)
        self.assertIn("from this chat", identity_answer)
        self.assertTrue(identity_suggestions)

        question_reply = conversational_reply("I want to ask a question", "Atif")
        self.assertIsNotNone(question_reply)
        question_answer, question_suggestions = question_reply or ("", [])
        self.assertIn("go ahead", question_answer)
        self.assertTrue(question_suggestions)

        project_reply = conversational_reply("I want to ask about a project", "Atif")
        self.assertIsNotNone(project_reply)
        project_answer, project_suggestions = project_reply or ("", [])
        self.assertIn("tell me about the project", project_answer)
        self.assertTrue(any("space" in item for item in project_suggestions))

        topic_reply = conversational_reply(
            "Not about a project actually sorry. I want to ask about something else",
            "Atif",
        )
        self.assertIsNotNone(topic_reply)
        topic_answer, topic_suggestions = topic_reply or ("", [])
        self.assertIn("No problem", topic_answer)
        self.assertIn("rather than make up", topic_answer)
        self.assertTrue(topic_suggestions)

        self.assertIsNone(
            conversational_reply("What products do you offer?", "Atif")
        )

    def test_common_spelling_errors_do_not_break_chat_intent_or_retrieval(self) -> None:
        identity_reply = conversational_reply("Do you knwo me", "Atif")
        self.assertIsNotNone(identity_reply)
        identity_answer, _ = identity_reply or ("", [])
        self.assertIn("Atif", identity_answer)

        question_reply = conversational_reply(
            "I wnat to ask a qusetion", "Atif"
        )
        self.assertIsNotNone(question_reply)
        self.assertIn("go ahead", (question_reply or ("", []))[0])

        self.assertEqual(
            normalize_query_spelling("What prodcuts do you ofer?"),
            "What products do you offer?",
        )
        self.assertEqual(
            retrieve_knowledge("What prodcuts do you ofer?", limit=1)[0]["id"],
            "catalog-overview",
        )
        typo_sources = retrieve_knowledge("What prodcuts do you ofer?")
        typo_answer = local_answer(
            "What prodcuts do you ofer?",
            typo_sources,
            "Atif",
            retrieval_query="What prodcuts do you ofer?",
        )
        self.assertIn("made-to-order", typo_answer)
        self.assertEqual(normalize_query_spelling("Do you sell food?"), "Do you sell food?")

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
