export function PublicDataUnavailable() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
      <h1 className="text-3xl font-semibold text-text-primary">
        Concept content is temporarily unavailable
      </h1>
      <p role="status" className="mt-4 text-text-secondary">
        The prototype could not load its database-backed public content. Please
        try again when the API is available.
      </p>
    </main>
  );
}
