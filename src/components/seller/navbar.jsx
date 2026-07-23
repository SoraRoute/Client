import { Bell } from "lucide-react";

export default function SellerTopNavbar() {
	return (
		<header className="flex h-16 items-center justify-between border-b border-paper-line bg-paper-raised px-6">

			{/* Website Logo */}
			<div className="flex items-center gap-3">
				<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500 text-lg font-bold text-white">
					M
				</div>

				<div>
					<h1 className="font-display text-lg font-bold text-ink">
						MarketHive
					</h1>

					<p className="text-xs text-ink-muted">
						Seller Dashboard
					</p>
				</div>
			</div>


			{/* Right Actions */}
			<div className="flex items-center gap-4">
				<button
					className="rounded-xl p-2 text-ink-muted hover:bg-paper"
				>
					<Bell size={20} />
				</button>
			</div>

		</header>
	);
}