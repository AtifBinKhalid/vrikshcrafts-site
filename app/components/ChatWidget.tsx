"use client";

import { FormEvent, useEffect, useId, useRef, useState } from "react";

type Source = {
  id: string;
  title: string;
  url: string;
};

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  suggestions?: string[];
  isError?: boolean;
  isWelcome?: boolean;
};

type ChatResponse = {
  answer?: string;
  error?: string;
  sources?: Source[];
  suggestions?: string[];
};

const VISITOR_NAME_KEY = "vrikshcraftsVisitorName";

const QUICK_QUESTIONS = [
  "What products do you offer?",
  "Can you customize for my brand?",
  "Do you ship across India?",
];

const NAME_PROMPT: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi! I’m the vrikshcrafts assistant. Before we get started, what name should I use for you?",
  isWelcome: true,
};

function welcomeMessage(name: string): Message {
  return {
    id: "welcome",
    role: "assistant",
    content: `Nice to meet you, ${name}! 👋 Tell me what you’re planning—even a rough idea is fine—and I’ll help you work through products, customization, shipping, or next steps.`,
    isWelcome: true,
  };
}

function readVisitorName(value: string) {
  const rawValue = value.trim();
  const hasSelfIntroduction =
    /^(?:hi[,! ]+)?(?:i am|i'm|my name is|call me)\s+/i.test(rawValue);
  if (
    /[?]/.test(rawValue) ||
    (/^(hi|hello|hey|namaste|namaskar)\b/i.test(rawValue) &&
      !hasSelfIntroduction)
  ) {
    return null;
  }

  const candidate = rawValue
    .replace(/^(?:hi[,! ]+)?(?:i am|i'm|my name is|call me)\s+/i, "")
    .replace(/[.!]+$/, "")
    .trim();

  if (
    candidate.length < 2 ||
    candidate.length > 40 ||
    candidate.split(/\s+/).length > 3 ||
    !/^[\p{L}][\p{L}\p{M}' -]*$/u.test(candidate)
  ) {
    return null;
  }

  return candidate
    .split(/\s+/)
    .map((part) => part.charAt(0).toLocaleUpperCase() + part.slice(1))
    .join(" ");
}

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

function MessageText({ message }: { message: Message }) {
  return (
    <div className="chat-message-content">
      {message.content.split(/\n{2,}/).map((block, blockIndex) => {
        const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
        const listItems = lines.map((line) =>
          line.match(/^(?:[-•]|\d+[.)])\s+(.+)$/)?.[1],
        );
        if (lines.length > 0 && listItems.every(Boolean)) {
          return (
            <ul key={`${message.id}-list-${blockIndex}`}>
              {listItems.map((item, itemIndex) => (
                <li key={`${message.id}-item-${blockIndex}-${itemIndex}`}>{item}</li>
              ))}
            </ul>
          );
        }
        return <p key={`${message.id}-paragraph-${blockIndex}`}>{block}</p>;
      })}
    </div>
  );
}

export default function ChatWidget() {
  const titleId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([NAME_PROMPT]);
  const [visitorName, setVisitorName] = useState("");
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedName = readVisitorName(
      globalThis.localStorage?.getItem(VISITOR_NAME_KEY) || "",
    );
    if (!savedName) return;

    setVisitorName(savedName);
    setMessages([welcomeMessage(savedName)]);
  }, []);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, isLoading]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, []);

  async function ask(nextQuestion: string, website = "") {
    const trimmedQuestion = nextQuestion.trim();
    if (isLoading || trimmedQuestion.length < 2) return;

    if (!visitorName) {
      const name = readVisitorName(trimmedQuestion);
      if (!name) {
        setMessages((current) => [
          ...current,
          {
            id: createId(),
            role: "assistant",
            content: "I didn’t quite catch your name. Just your first name is perfect.",
            isError: true,
            isWelcome: true,
          },
        ]);
        return;
      }

      globalThis.localStorage?.setItem(VISITOR_NAME_KEY, name);
      setVisitorName(name);
      setMessages((current) => [
        ...current,
        {
          id: createId(),
          role: "user",
          content: name,
          isWelcome: true,
        },
        { ...welcomeMessage(name), id: createId() },
      ]);
      setQuestion("");
      return;
    }

    const history = messages
      .filter((message) => !message.isWelcome && !message.isError)
      .slice(-8)
      .map(({ role, content }) => ({ role, content }));

    setMessages((current) => [
      ...current,
      { id: createId(), role: "user", content: trimmedQuestion },
    ]);
    setQuestion("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmedQuestion,
          history,
          visitorName,
          website,
        }),
      });
      const data = (await response.json().catch(() => null)) as ChatResponse | null;

      if (!response.ok || !data?.answer) {
        throw new Error(data?.error || "The assistant could not answer right now.");
      }

      setMessages((current) => [
        ...current,
        {
          id: createId(),
          role: "assistant",
          content: data.answer!,
          sources: data.sources,
          suggestions: data.suggestions,
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: createId(),
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "I’m having trouble answering right now. Please try again in a moment.",
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    ask(question, String(formData.get("website") || ""));
  }

  return (
    <div className="chat-widget">
      {isOpen && (
        <section
          className="chat-panel"
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
        >
          <header className="chat-header">
            <div>
              <p id={titleId} className="chat-title">
                vrikshcrafts assistant
              </p>
              <p className="chat-status">
                <span aria-hidden="true" /> Website knowledge
              </p>
            </div>
            <button
              type="button"
              className="chat-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close assistant"
            >
              ×
            </button>
          </header>

          <div className="chat-messages" aria-live="polite" aria-busy={isLoading}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`chat-message chat-message-${message.role}${
                  message.isError ? " chat-message-error" : ""
                }`}
              >
                <MessageText message={message} />
                {message.sources && message.sources.length > 0 && (
                  <div className="chat-sources" aria-label="Verified sources">
                    <span className="chat-sources-label">Based on vrikshcrafts knowledge</span>
                    {message.sources.map((source) => (
                      <a key={source.id} href={source.url}>
                        {source.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {visitorName && !isLoading && (
              <div className="chat-suggestions" aria-label="Suggested questions">
                {(messages.every((message) => message.isWelcome)
                  ? QUICK_QUESTIONS
                  : messages.at(-1)?.suggestions || []
                ).map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => ask(suggestion)}
                    disabled={isLoading}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {isLoading && (
              <div className="chat-message chat-message-assistant chat-typing">
                <span />
                <span />
                <span />
                <span className="chat-typing-label">Looking that up…</span>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form className="chat-form" onSubmit={handleSubmit}>
            <div className="chat-honeypot" aria-hidden="true">
              <label>
                Website
                <input name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>
            <label className="sr-only" htmlFor={`${titleId}-question`}>
              {visitorName ? "Ask vrikshcrafts a question" : "Your first name"}
            </label>
            <input
              ref={inputRef}
              id={`${titleId}-question`}
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              maxLength={visitorName ? 600 : 40}
              placeholder={
                visitorName ? "Ask about products or projects…" : "Your first name…"
              }
              autoComplete={visitorName ? "off" : "given-name"}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || question.trim().length < 2}
              aria-label="Send question"
            >
              Send
            </button>
          </form>
          <p className="chat-disclaimer">
            Grounded in approved vrikshcrafts information. Exact project details require team confirmation.
          </p>
        </section>
      )}

      <button
        type="button"
        className="chat-launcher"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close vrikshcrafts assistant" : "Open vrikshcrafts assistant"}
      >
        <span className="chat-launcher-mark" aria-hidden="true">
          {isOpen ? "×" : "?"}
        </span>
        <span>{isOpen ? "Close" : "Ask us"}</span>
      </button>
    </div>
  );
}
