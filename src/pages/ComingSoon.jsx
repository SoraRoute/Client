// Shared Module
// Authors: Nishtha & Pinki

export default function ComingSoon({ title }) {
    return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-2 text-center">
            <h1 className="font-display text-2xl font-semibold">{title}</h1>
            <p className="text-sm text-ink-muted">
                This screen is built in a later module — routing and layout are wired up
                already.
            </p>
        </div>
    );
}
