import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

let modalStack = [];
const BASE_Z = 1000;

export default function Modal({ open, onClose, title, children, className = "" }) {
  const elRef = useRef(null);
  const dialogRef = useRef(null);
  const triggerFocusedEl = useRef(null);
  const [zIndex, setZIndex] = useState(BASE_Z);

  if (!elRef.current) {
    elRef.current = document.createElement("div");
  }

  useEffect(() => {
    document.body.appendChild(elRef.current);
    return () => {
      if (elRef.current.parentNode) {
        elRef.current.parentNode.removeChild(elRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    modalStack.push(elRef.current);
    setZIndex(BASE_Z + modalStack.length);
    triggerFocusedEl.current = document.activeElement;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      modalStack = modalStack.filter((m) => m !== elRef.current);
      if (modalStack.length === 0) {
        document.body.style.overflow = prevOverflow || "";
      }
      triggerFocusedEl.current?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e) {
      if (e.key === "Escape") {
        onClose?.();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex }}
      onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      <div
        ref={dialogRef}
        className={`relative max-w-lg w-full mx-4 rounded-lg shadow-2xl bg-white p-4 ${className}`}
        style={{ zIndex: zIndex + 1 }}
      >
        <div className="flex items-start justify-between">
          {title && <h2 className="text-lg font-semibold">{title}</h2>}
          <button
            onClick={() => onClose?.()}
            className="ml-2 rounded-md p-1 hover:bg-gray-200 focus:outline-none"
          >
            ✕
          </button>
        </div>
        <div className="mt-2">{children}</div>
      </div>
    </div>,
    elRef.current
  );
}
