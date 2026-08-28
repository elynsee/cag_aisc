/**
 * Chat entry — a Text Input Field variant used to describe a claim in prose.
 * Spec: docs/inputs/text-input-field.md
 *   · Visible label above the field (never placeholder-only).
 *   · Helper text carries the AI disclosure.
 *   · Enter submits; the send control is disabled until there is input, so an
 *     empty claim cannot be raised.
 * Focus: §9.2 two-layer input treatment on the shell.
 */
import { useState } from "react";
import { ArrowUpIcon, PlusIcon } from "./Icon";
import "./ChatInput.css";

interface ChatInputProps {
  onSubmit: (text: string) => void;
  onAttach: () => void;
}

export function ChatInput({ onSubmit, onAttach }: ChatInputProps) {
  const [draft, setDraft] = useState("");
  const canSend = draft.trim().length > 0;

  const send = () => {
    if (!canSend) return;
    onSubmit(draft.trim());
    setDraft("");
  };

  return (
    <div className="dls-chat">
      <label className="dls-chat__label t-body-sm-bold" htmlFor="claim-chat">
        Describe your claim
      </label>

      <div className="dls-chat__shell">
        <button
          type="button"
          className="dls-chat__attach"
          aria-label="Add an attachment"
          onClick={onAttach}
        >
          <PlusIcon />
        </button>

        <input
          id="claim-chat"
          className="dls-chat__input t-body"
          value={draft}
          autoComplete="off"
          placeholder="Taxi from Jewel to HQ on 26 Aug, $18.40, no receipt"
          aria-describedby="claim-chat-helper"
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              send();
            }
          }}
        />

        <button
          type="button"
          className={`dls-chat__send${canSend ? " dls-chat__send--active" : ""}`}
          aria-label="Send"
          disabled={!canSend}
          onClick={send}
        >
          <ArrowUpIcon />
        </button>
      </div>

      <span id="claim-chat-helper" className="dls-chat__helper t-small">
        Answers are AI-generated. Check the details before you submit.
      </span>
    </div>
  );
}
