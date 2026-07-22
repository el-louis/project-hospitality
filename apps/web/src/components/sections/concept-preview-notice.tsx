export function ConceptPreviewNotice({ notice }: { notice?: string | null }) {
  if (!notice) return null;
  return (
    <aside className="bg-primary px-4 py-3 text-center text-sm text-white" aria-label="Concept preview notice">
      {notice}
    </aside>
  );
}
