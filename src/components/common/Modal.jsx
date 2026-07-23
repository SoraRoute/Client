import { X } from "lucide-react";

export default function Modal({ open, title, onClose, children }) {
<<<<<<< HEAD:src/components/common/Modal.jsx
    // Don't render the modal when it's closed.
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">

            {/* Background overlay */}
            <div
                className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal content */}
            <div className="relative max-h-full w-full max-w-md overflow-y-auto rounded-2xl bg-paper-raised p-6 shadow-pop">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>

                    {/* Close button */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted hover:bg-ink/5 hover:text-ink"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                </div>

                {children}
            </div>
        </div>
    );
}
=======
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative max-h-full w-full max-w-md overflow-y-auto rounded-2xl bg-paper-raised p-6 shadow-pop">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted hover:bg-ink/5 hover:text-ink"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
>>>>>>> b20d65c5009e214c0e23d479dfc58436b53b8650:Client/src/components/common/Modal.jsx
