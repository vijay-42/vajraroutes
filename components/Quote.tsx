"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import Icon from "./Icon";
import EnquiryForm from "./EnquiryForm";

type Ctx = { open: (destination?: string) => void };
const QuoteContext = createContext<Ctx>({ open: () => {} });
export const useQuote = () => useContext(QuoteContext);

export function QuoteProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [destination, setDestination] = useState("");

  const open = useCallback((d = "") => {
    setDestination(d);
    setOpen(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  return (
    <QuoteContext.Provider value={{ open }}>
      {children}
      <div className={`modal ${isOpen ? "is-open" : ""}`} aria-hidden={!isOpen}>
        <div className="modal__backdrop" onClick={() => setOpen(false)} />
        <div className="modal__dialog" role="dialog" aria-modal="true" aria-label="Get a free quote">
          <button className="modal__close" onClick={() => setOpen(false)} aria-label="Close">
            <Icon name="close" />
          </button>
          {isOpen && <EnquiryForm key={destination} defaultDestination={destination} />}
        </div>
      </div>
    </QuoteContext.Provider>
  );
}

export function QuoteButton({ className = "btn btn--black", destination, children }: { className?: string; destination?: string; children: React.ReactNode }) {
  const { open } = useQuote();
  return (
    <button type="button" className={className} onClick={() => open(destination)}>
      {children}
    </button>
  );
}
