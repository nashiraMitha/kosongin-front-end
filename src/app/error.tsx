"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Terjadi error!</h2>
      <button onClick={() => reset()}>Coba lagi</button>
    </div>
  );
}