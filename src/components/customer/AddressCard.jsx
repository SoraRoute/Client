// Customer Frontend
// Author: Nishtha

import { MapPin, Pencil, Trash2 } from "lucide-react";

export default function AddressCard({ address, onEdit, onDelete, selectable, selected, onSelect }) {

    return (

        <div
            onClick={selectable ? () => onSelect(address) : undefined}
            className={[
                "rounded-2xl border p-4 transition-colors",
                selectable ? "cursor-pointer" : "",
                selected ? "border-gold-500 bg-gold-50/40" : "border-paper-line bg-paper-raised",
            ].join(" ")}
        >
            <div className="flex items-start justify-between gap-3">

                {/* Address details */}
                <div className="flex items-start gap-2">
                    <MapPin size={16} className="mt-0.5 shrink-0 text-ink-muted" />

                    <div>

                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                                {address.address_type || "home"}
                            </span>

                            {/* Highlight the default delivery address */}
                            {address.is_default ? (
                                <span className="rounded-full bg-gold-50 px-2 py-0.5 text-[11px] font-medium text-gold-700">
                                    Default
                                </span>
                            ) : null}
                        </div>

                        <p className="mt-1 text-sm text-ink">
                            {address.address_line1}
                            {address.address_line2 ? `, ${address.address_line2}` : ""}
                        </p>

                        <p className="text-sm text-ink-muted">
                            {address.city}, {address.state} {address.pincode}
                        </p>

                        <p className="text-sm text-ink-muted">{address.country}</p>

                    </div>
                </div>

                {/* Edit/Delete actions */}
                {(onEdit || onDelete) && (

                    <div className="flex shrink-0 items-center gap-1">
                        {onEdit ? (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(address);
                                }}
                                className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted hover:bg-ink/5 hover:text-ink"
                                aria-label="Edit address"
                            >
                                <Pencil size={14} />
                            </button>
                        ) : null}

                        {onDelete ? (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(address);
                                }}
                                className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted hover:bg-danger-50 hover:text-danger-500"
                                aria-label="Delete address"
                            >
                                <Trash2 size={14} />
                            </button>

                        ) : null}

                    </div>
                )}
            </div>

        </div>
    );
}