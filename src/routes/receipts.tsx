import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { formatPrice, loadOrders, paymentAccounts, type StoreOrder } from "@/lib/checkout";

export const Route = createFileRoute("/receipts")({
  head: () => ({
    meta: [
      { title: "Receipts received | Luxora" },
      { name: "description", content: "Payment slips and transaction IDs received for Luxora orders." },
    ],
  }),
  component: ReceiptsPage,
});

function ReceiptsPage() {
  const [orders, setOrders] = useState<StoreOrder[]>([]);

  useEffect(() => {
    const refresh = () => setOrders(loadOrders());
    refresh();
    const timer = window.setInterval(refresh, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className="receipts-page">
      <div className="receipts-page__inner">
        <Link to="/" className="receipts-back"><ArrowLeft size={16} aria-hidden="true" /> Back to shop</Link>
        <p className="collections-kicker">RECEIPTS RECEIVED</p>
        <h1>Payment slips</h1>
        <p className="receipts-lead">Every transaction ID and receipt stays here until the backend is connected. Verified orders show an order number, a tracker, and a 48-hour delivery window.</p>
        {orders.length === 0 ? (
          <p className="receipts-empty">No receipts yet. A payment appears here as soon as a customer submits a slip.</p>
        ) : (
          <ul className="receipts-list">
            {orders.map((order) => {
              const method = paymentAccounts.find((item) => item.id === order.method);
              return (
                <li key={order.id} className="receipt-card">
                  <img src={order.receiptDataUrl} alt={`Receipt for ${order.transactionId}`} />
                  <div>
                    <div className="receipt-card__top">
                      <strong>{order.customerName}</strong>
                      <span className={`receipt-badge ${order.status === "confirmed" ? "receipt-badge--done" : ""}`}>
                        {order.status === "verifying" ? "Being verified" : "Confirmed"}
                      </span>
                    </div>
                    <p>{method?.name} · {order.phone}</p>
                    <p>Transaction ID <b>{order.transactionId}</b></p>
                    <p>Paid to {order.accountTitle} · {order.accountNumber}</p>
                    <p>{formatPrice(order.total)} · {order.items.map((item) => `${item.name} × ${item.qty}`).join(", ")}</p>
                    {order.status === "confirmed" ? (
                      <p className="receipt-card__codes">Order {order.orderNumber} · Tracker {order.trackerNumber} · Delivery within 48 hours</p>
                    ) : (
                      <p className="receipt-card__wait">Your payment is being verified.</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
