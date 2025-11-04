"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { MessageSquare, Mail, Github, Facebook, ExternalLink, Copy, X } from "lucide-react";

type ContactModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const contacts = [
  {
    label: "Discord",
    value: "@pcstyle",
    icon: MessageSquare,
    href: null,
  },
  {
    label: "Email",
    value: "adamkrupa@tuta.io",
    icon: Mail,
    href: "mailto:adamkrupa@tuta.io",
  },
  {
    label: "GitHub",
    value: "pc-style",
    icon: Github,
    href: "https://github.com/pc-style",
  },
  {
    label: "Facebook",
    value: "adam.krupa.771",
    icon: Facebook,
    href: "https://www.facebook.com/adam.krupa.771/",
  },
];

function copyToClipboard(text: string) {
  // prosta funkcja do kopiowania, nie zawsze idealna ale działa
  navigator.clipboard?.writeText(text);
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  // zamknij modal przy ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      return () => document.removeEventListener("keydown", handleEsc);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* modal */}
          <motion.div
            className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-lg -translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 0, scale: 0.9, y: "-45%" }}
            animate={{ opacity: 1, scale: 1, y: "-50%" }}
            exit={{ opacity: 0, scale: 0.9, y: "-45%" }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <div className="brutal-border brutal-shadow relative overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-background)] p-8">
              {/* close button - top right */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center border-4 border-[var(--color-ink)] bg-[var(--color-background)] text-[color:var(--color-ink)] transition-transform hover:rotate-90 hover:scale-110 hover:bg-[var(--color-magenta)] hover:text-white"
                aria-label="Zamknij"
              >
                <X size={20} strokeWidth={3} />
              </button>

              {/* header */}
              <div className="mb-8">
                <h2 className="text-3xl font-black uppercase text-[color:var(--color-ink)] sm:text-4xl">
                  napisz hejka!
                </h2>
                <p className="mt-2 text-sm uppercase tracking-wide text-[color:var(--color-ink)]/60">
                  {"// wybierz sposób kontaktu"}
                </p>
              </div>

              {/* contact list */}
              <div className="flex flex-col gap-4">
                {contacts.map((contact) => {
                  const Icon = contact.icon;
                  return (
                    <motion.div
                      key={contact.label}
                      className="group relative overflow-hidden border-4 border-[var(--color-ink)] bg-[var(--color-background)] p-4 text-[color:var(--color-ink)] transition-all hover:border-[var(--color-magenta)] hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]"
                      whileHover={{ x: 4, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <Icon size={24} strokeWidth={2.5} />
                          <div>
                            <div className="text-xs font-semibold uppercase tracking-wider opacity-60">
                              {contact.label}
                            </div>
                            <div className="font-mono text-sm font-bold sm:text-base">
                              {contact.value}
                            </div>
                          </div>
                        </div>

                        {contact.href ? (
                          <a
                            href={contact.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-10 w-10 items-center justify-center border-4 border-[var(--color-ink)] bg-[var(--color-background)] text-[color:var(--color-ink)] transition-all hover:scale-110 hover:border-[var(--color-cyan)] hover:bg-[var(--color-cyan)] hover:text-[var(--color-background)]"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink size={18} strokeWidth={2.5} />
                          </a>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(contact.value);
                              // mały feedback że skopiowano
                            }}
                            className="flex h-10 w-10 items-center justify-center border-4 border-[var(--color-ink)] bg-[var(--color-background)] text-[color:var(--color-ink)] transition-all hover:scale-110 hover:border-[var(--color-magenta)] hover:bg-[var(--color-magenta)] hover:text-white"
                            title="Kopiuj"
                          >
                            <Copy size={18} strokeWidth={2.5} />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* decorative accent block */}
              <div
                className="pointer-events-none absolute -bottom-8 -right-8 h-24 w-24 rotate-12 border-4 border-[var(--color-ink)] bg-[var(--color-cyan)] opacity-30"
                aria-hidden
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

