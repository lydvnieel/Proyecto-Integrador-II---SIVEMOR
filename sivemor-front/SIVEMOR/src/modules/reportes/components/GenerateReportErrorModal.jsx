  export default function GenerateReportErrorModal({ message }) {
    if (!message) return null;

    return <div className="alert alert-danger mt-3">{message}</div>;
  }