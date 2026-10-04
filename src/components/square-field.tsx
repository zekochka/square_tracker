import { squareWord } from "@/lib/words";

export function SquareField({ count, small = false, animateLast = false }: {
  count: number;
  small?: boolean;
  animateLast?: boolean;
}) {
  return (
    <div className={`square-field ${small ? "square-field-small" : ""}`} aria-label={`${count} ${squareWord(count)}`}>
      {Array.from({ length: count }, (_, index) => (
        <span key={index} className={`square-tile ${animateLast && index === count - 1 ? "square-new" : ""}`}
          aria-hidden="true" />
      ))}
    </div>
  );
}

