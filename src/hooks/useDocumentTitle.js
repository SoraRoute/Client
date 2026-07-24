// Shared Module
// Authors: Nishtha & Pinki

import { useEffect } from "react";

export default function useDocumentTitle(title) {
    useEffect(() => {
        document.title = title ? `${title} · MarketHive` : "MarketHive";
    }, [title]);
}
