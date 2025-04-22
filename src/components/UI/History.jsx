export default function History({ onClose }) {
  return (
    <div className="history-container">
      <h2>Order History</h2>
      <p>Your past orders will be displayed here.</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
