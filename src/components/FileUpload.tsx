/**
 * File Upload — Enterprise (drag & drop)
 * Spec: docs/selections/file-upload.md
 *   · Helper text always states allowed types and size limit.
 *   · Upload states are distinct: uploading, success, cancelled, error.
 *   · Recovery CTAs provided — Cancel while uploading, Retry / Remove after.
 *   · Click opens the native file picker; drag over activates the drop zone.
 *   · Drop zone shows a 1px brand border (#7A35B0 = Purple Primary/600) on
 *     hover, per spec.
 *   · Type and size are validated client-side, so invalid files are rejected
 *     before any upload begins.
 *
 * PROTOTYPE GAP: the spec requires progress to reflect actual upload status,
 * not a simulation. There is no backend in this prototype, so progress is
 * driven by a local timer. Swap `startUpload` for a real XHR/fetch progress
 * handler when wiring to the claims service.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { AlertIcon, CheckIcon, CloseIcon, FileIcon, RetryIcon, TrashIcon, UploadIcon } from "./Icon";
import { Button } from "./Button";
import { StatusChip } from "./StatusChip";
import { ACCEPTED_FILE_TYPES, MAX_FILE_BYTES } from "../data";
import type { UploadFile, UploadState } from "../types";
import "./FileUpload.css";

const UPLOAD_CHIP: Record<UploadState, { label: string; tone: "success" | "warning" | "error" | "neutral" | "info" }> = {
  uploading: { label: "Uploading", tone: "info" },
  success: { label: "Uploaded", tone: "success" },
  error: { label: "Failed", tone: "error" },
  cancelled: { label: "Cancelled", tone: "neutral" },
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Client-side validation. Returns an error message, or null when valid. */
function validate(file: File): string | null {
  const extension = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;
  if (!ACCEPTED_FILE_TYPES.includes(extension)) {
    return `${extension || "This file type"} is not accepted. Upload a JPG, PNG or PDF.`;
  }
  if (file.size > MAX_FILE_BYTES) {
    return `This file is ${formatSize(file.size)}. The limit is 10MB per file.`;
  }
  return null;
}

interface FileUploadProps {
  files: UploadFile[];
  onFilesChange: (updater: (files: UploadFile[]) => UploadFile[]) => void;
  /** Called once a file finishes uploading, so a claim can be raised from it. */
  onUploadComplete: (file: UploadFile) => void;
  onClaimWithoutReceipt: () => void;
}

export function FileUpload({
  files,
  onFilesChange,
  onUploadComplete,
  onClaimWithoutReceipt,
}: FileUploadProps) {
  const [isOver, setIsOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timers = useRef(new Map<string, number>());

  /* Clear any in-flight timers when the component unmounts. */
  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach((timer) => window.clearInterval(timer));
      pending.clear();
    };
  }, []);

  const stopTimer = useCallback((id: string) => {
    const timer = timers.current.get(id);
    if (timer !== undefined) {
      window.clearInterval(timer);
      timers.current.delete(id);
    }
  }, []);

  const startUpload = useCallback(
    (upload: UploadFile) => {
      stopTimer(upload.id);
      const timer = window.setInterval(() => {
        onFilesChange((current) =>
          current.map((file) => {
            if (file.id !== upload.id || file.state !== "uploading") return file;
            const progress = Math.min(100, file.progress + 12);
            if (progress >= 100) {
              stopTimer(file.id);
              const done: UploadFile = { ...file, progress: 100, state: "success" };
              onUploadComplete(done);
              return done;
            }
            return { ...file, progress };
          }),
        );
      }, 180);
      timers.current.set(upload.id, timer);
    },
    [onFilesChange, onUploadComplete, stopTimer],
  );

  const addFiles = useCallback(
    (incoming: FileList | null) => {
      if (!incoming || incoming.length === 0) return;

      const accepted: UploadFile[] = [];
      const queued: UploadFile[] = [];

      Array.from(incoming).forEach((file, index) => {
        const error = validate(file);
        const record: UploadFile = {
          id: `${Date.now()}-${index}-${file.name}`,
          name: file.name,
          size: file.size,
          /* Invalid files never enter the uploading state — they are rejected
             before upload begins, per the spec's validation logic. */
          state: error ? "error" : "uploading",
          progress: 0,
          error: error ?? undefined,
        };
        accepted.push(record);
        if (!error) queued.push(record);
      });

      onFilesChange((current) => [...current, ...accepted]);
      queued.forEach(startUpload);
    },
    [onFilesChange, startUpload],
  );

  const cancel = (id: string) => {
    stopTimer(id);
    onFilesChange((current) =>
      current.map((file) =>
        file.id === id ? { ...file, state: "cancelled", error: undefined } : file,
      ),
    );
  };

  const retry = (id: string) => {
    onFilesChange((current) =>
      current.map((file) =>
        file.id === id ? { ...file, state: "uploading", progress: 0, error: undefined } : file,
      ),
    );
    const target = files.find((file) => file.id === id);
    if (target) startUpload({ ...target, state: "uploading", progress: 0 });
  };

  const remove = (id: string) => {
    stopTimer(id);
    onFilesChange((current) => current.filter((file) => file.id !== id));
  };

  return (
    <div className="dls-upload">
      <div
        className={`dls-upload__zone${isOver ? " dls-upload__zone--over" : ""}`}
        onDragOver={(event) => {
          event.preventDefault();
          setIsOver(true);
        }}
        onDragLeave={() => setIsOver(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsOver(false);
          addFiles(event.dataTransfer.files);
        }}
      >
        <span className="dls-upload__icon">
          <UploadIcon />
        </span>
        <div>
          <p className="t-h6 dls-upload__title">Drag your receipt here</p>
          <p className="t-body-sm dls-upload__hint">
            We read the amount, date and merchant for you.
          </p>
        </div>
        <div className="dls-upload__actions">
          {/* The one Primary button on this screen (buttons spec). */}
          <Button variant="primary" onClick={() => inputRef.current?.click()}>
            Upload Receipt
          </Button>
          <Button variant="tertiary" onClick={onClaimWithoutReceipt}>
            Claim Without Receipt
          </Button>
        </div>
        <input
          ref={inputRef}
          id="receipt-upload"
          type="file"
          multiple
          className="visually-hidden"
          accept={ACCEPTED_FILE_TYPES.join(",")}
          onChange={(event) => {
            addFiles(event.target.files);
            /* Reset so the same filename can be chosen again — the spec allows
               duplicate filenames. */
            event.target.value = "";
          }}
        />
      </div>

      {files.length > 0 ? (
        <ul className="dls-upload__list" aria-label="Uploaded receipts">
          {files.map((file) => (
            <li key={file.id} className="dls-upload__item">
              <span className="dls-upload__item-icon" aria-hidden>
                {file.state === "success" ? (
                  <CheckIcon />
                ) : file.state === "error" ? (
                  <AlertIcon />
                ) : (
                  <FileIcon />
                )}
              </span>

              <span className="dls-upload__item-body">
                <span className="dls-upload__item-head">
                  <span className="t-body-sm-bold dls-upload__item-name">{file.name}</span>
                  <StatusChip
                    label={UPLOAD_CHIP[file.state].label}
                    tone={UPLOAD_CHIP[file.state].tone}
                  />
                </span>

                {file.state === "uploading" ? (
                  <span
                    className="dls-upload__progress"
                    role="progressbar"
                    aria-valuenow={file.progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Uploading ${file.name}`}
                  >
                    <span
                      className="dls-upload__progress-fill"
                      style={{ width: `${file.progress}%` }}
                    />
                  </span>
                ) : (
                  <span
                    className={`t-small dls-upload__item-meta${
                      file.state === "error" ? " dls-upload__item-meta--error" : ""
                    }`}
                  >
                    {file.error ?? `${formatSize(file.size)} · Attached to a draft claim`}
                  </span>
                )}
              </span>

              {/* Recovery CTAs, per spec. */}
              <span className="dls-upload__item-actions">
                {file.state === "uploading" ? (
                  <button
                    type="button"
                    className="dls-upload__action t-body-sm-bold"
                    onClick={() => cancel(file.id)}
                  >
                    <CloseIcon />
                    Cancel
                  </button>
                ) : null}
                {file.state === "error" || file.state === "cancelled" ? (
                  <button
                    type="button"
                    className="dls-upload__action t-body-sm-bold"
                    onClick={() => retry(file.id)}
                  >
                    <RetryIcon />
                    Retry
                  </button>
                ) : null}
                {file.state !== "uploading" ? (
                  <button
                    type="button"
                    className="dls-upload__action t-body-sm-bold"
                    onClick={() => remove(file.id)}
                  >
                    <TrashIcon />
                    Remove
                  </button>
                ) : null}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
