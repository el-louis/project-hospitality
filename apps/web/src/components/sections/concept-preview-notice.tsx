export function ConceptPreviewNotice({ notice }: { notice?: string | null }) {
  if (!notice) return null;
  return (
    <aside
      className="border-b border-primary/20 bg-primary px-4 py-2.5 text-white"
      aria-label="Concept preview notice"
    >
      <div className="mx-auto flex max-w-7xl flex-col justify-center gap-1 text-center text-xs sm:flex-row sm:gap-2 sm:text-sm">
        <strong className="font-semibold">
          Digital Experience — Concept Preview.
        </strong>
        <span>
          {notice.replace(
            /^Red Masai Digital Experience — Concept Preview\.\s*/i,
            "",
          )}
        </span>
      </div>
    </aside>
  );
}
