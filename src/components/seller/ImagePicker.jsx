import { useRef } from "react";
import { ImagePlus, X } from "lucide-react";

// Upload restrictions
const MAX_FILES = 5;
const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export default function ImagePicker({ files, onChange, error }) {
	const inputRef = useRef(null);

	// Add newly selected files while keeping the limit.
	function handleFileSelect(e) {
		const selected = Array.from(e.target.files || []);

		// Reset input so the same file can be selected again.
		e.target.value = "";

		const combined = [...files, ...selected].slice(0, MAX_FILES);
		onChange(combined);
	}

	// Remove an image from the current selection.
	function removeFile(index) {
		onChange(files.filter((_, i) => i !== index));
	}

	// Find files that don't satisfy the upload rules.
	const invalidFiles = files.filter(
		(file) => !ACCEPTED_TYPES.includes(file.type) || file.size > MAX_SIZE_BYTES,
	);

	return (
		<div>
			{/* Image upload label */}
			<span className="mb-1.5 block text-sm font-medium text-ink-soft">
				Product images <span className="text-ink-muted">(up to 5 · JPG, PNG or WEBP · max 5MB each)</span>
			</span>

			{/* Selected image previews */}
			<div className="flex flex-wrap gap-3">
				{files.map((file, index) => (
					<div
						key={`${file.name}-${index}`}
						className="relative h-20 w-20 overflow-hidden rounded-xl border border-paper-line"
					>
						<img
							src={URL.createObjectURL(file)}
							alt={file.name}
							className="h-full w-full object-cover"
						/>

						{/* Remove image button */}
						<button
							type="button"
							onClick={() => removeFile(index)}
							className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ink/70 text-paper"
							aria-label="Remove image"
						>
							<X size={12} />
						</button>
					</div>
				))}

				{/* Show upload button until the limit is reached */}
				{files.length < MAX_FILES ? (
					<button
						type="button"
						onClick={() => inputRef.current?.click()}
						className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-paper-line text-ink-muted hover:border-teal-500 hover:text-teal-600"
					>
						<ImagePlus size={18} />
						<span className="text-[11px]">Add</span>
					</button>
				) : null}
			</div>

			{/* Hidden file input triggered by the Add button */}
			<input
				ref={inputRef}
				type="file"
				accept="image/jpeg,image/jpg,image/png,image/webp"
				multiple
				onChange={handleFileSelect}
				className="hidden"
			/>

			{/* Validation messages */}
			{invalidFiles.length > 0 ? (
				<p className="mt-1.5 text-xs text-danger-500">
					Some files aren&apos;t JPG/PNG/WEBP under 5MB and will be rejected on upload.
				</p>
			) : null}

			{error ? <p className="mt-1.5 text-xs text-danger-500">{error}</p> : null}
		</div>
	);
}