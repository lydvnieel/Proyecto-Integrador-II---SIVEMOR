export default function GenerateReportSuccessModal({ message }) {
  if (!message) return null;

  return <div className="alert alert-success mt-3">{message}</div>;
}