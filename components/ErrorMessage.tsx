export default function ErrorMessage({ message }: { message: string }) {
  return <p role="alert" className="ui mt-6 border-l-4 px-4 py-2 text-sm" style={{ borderColor: "var(--warn)", color: "var(--warn)" }}>{message}</p>;
}
