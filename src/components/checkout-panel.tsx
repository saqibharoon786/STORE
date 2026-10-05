import { Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Check, Copy, LoaderCircle, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  formatPrice,
  loadOrders,
  paymentAccounts,
  placeOrder,
  readReceiptFile,
  type CheckoutItem,
  type PaymentId,
  type StoreOrder,
} from "@/lib/checkout";

type CheckoutPanelProps = {
  items: CheckoutItem[];
  total: number;
  onClose: () => void;
  onPaid: () => void;
};

export function CheckoutPanel({ items, total, onClose, onPaid }: CheckoutPanelProps) {
  const [method, setMethod] = useState<PaymentId | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [receiptName, setReceiptName] = useState("");
  const [receiptDataUrl, setReceiptDataUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<StoreOrder | null>(null);

  const account = paymentAccounts.find((item) => item.id === method);

  useEffect(() => {
    if (!order || order.status !== "verifying") return;
    const wait = Math.max(0, order.verifyAt - Date.now());
    const timer = window.setTimeout(() => {
      const fresh = loadOrders().find((item) => item.id === order.id);
      if (fresh) setOrder(fresh);
    }, wait + 40);
    return () => window.clearTimeout(timer);
  }, [order]);

  const copyNumber = async (number: string) => {
    try {
      await navigator.clipboard.writeText(number);
    } catch {
      const field = document.createElement("textarea");
      field.value = number;
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      field.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const onReceipt = async (file: File | undefined) => {
    if (!file) return;
    setError("");
    try {
      setReceiptDataUrl(await readReceiptFile(file));
      setReceiptName(file.name);
    } catch (reason) {
      setReceiptDataUrl("");
      setReceiptName("");
      setError(reason instanceof Error ? reason.message : "Upload a photo of the receipt.");
    }
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!account) {
      setError("Choose EasyPaisa, JazzCash, or a bank account.");
      return;
    }
    if (!customerName.trim() || !phone.trim() || !transactionId.trim() || !receiptDataUrl) {
      setError("Add your name, phone, transaction ID, and the receipt photo.");
      return;
    }
    const placed = placeOrder({
      method: account.id,
      accountTitle: account.title,
      accountNumber: account.number,
      customerName: customerName.trim(),
      phone: phone.trim(),
      transactionId: transactionId.trim(),
      receiptDataUrl,
      items,
      total,
    });
    setOrder(placed);
    setError("");
    onPaid();
  };

  return (
    <div className="pay-layer">
      <button type="button" className="cart-backdrop" aria-label="Close payment" onClick={onClose} />
      <section className="pay-panel" aria-label="Payment">
        <header className="pay-panel__head">
          <div>
            <p className="collections-kicker">CHECKOUT</p>
            <h2>{order ? "Payment status" : "Choose how to pay"}</h2>
          </div>
          <button type="button" aria-label="Close payment" onClick={onClose}><X size={20} /></button>
        </header>

        {order?.status === "verifying" && (
          <div className="pay-status">
            <LoaderCircle className="pay-spin" size={28} aria-hidden="true" />
            <h3>Your payment is being verified</h3>
            <p>We have received your receipt and transaction ID. This usually takes a few moments. Your order number and tracker will appear here as soon as it is confirmed.</p>
            <dl>
              <div><dt>Transaction ID</dt><dd>{order.transactionId}</dd></div>
              <div><dt>Paid with</dt><dd>{paymentAccounts.find((item) => item.id === order.method)?.name}</dd></div>
              <div><dt>Amount</dt><dd>{formatPrice(order.total)}</dd></div>
            </dl>
          </div>
        )}

        {order?.status === "confirmed" && (
          <div className="pay-status">
            <span className="pay-status__check"><Check size={22} aria-hidden="true" /></span>
            <h3>Payment received. Your order is confirmed.</h3>
            <p>Delivery will reach you within 48 hours.</p>
            <dl className="pay-status__codes">
              <div><dt>Order number</dt><dd>{order.orderNumber}</dd></div>
              <div><dt>Tracker number</dt><dd>{order.trackerNumber}</dd></div>
            </dl>
            <ul className="pay-items">
              {order.items.map((item) => (
                <li key={item.name}>
                  <img src={item.image} alt="" width={56} height={56} />
                  <span><strong>{item.name}</strong><small>{item.qty} × {formatPrice(item.price)}</small></span>
                </li>
              ))}
            </ul>
            <p className="pay-status__total">Total {formatPrice(order.total)}</p>
            <Link to="/receipts" className="pay-link">Open receipts received</Link>
          </div>
        )}

        {!order && (
          <form className="pay-form" onSubmit={submit}>
            <p className="pay-form__lead">Total due <strong>{formatPrice(total)}</strong>. Send it to one account, then add your transaction ID and receipt.</p>
            <div className="pay-methods">
              {paymentAccounts.map((item) => (
                <button key={item.id} type="button" className={`pay-method ${method === item.id ? "pay-method--active" : ""}`} aria-pressed={method === item.id} onClick={() => { setMethod(item.id); setCopied(false); setError(""); }}>
                  <strong>{item.name}</strong>
                  <span>{item.detail}</span>
                </button>
              ))}
            </div>
            {account && (
              <div className="pay-account">
                <p>Account title</p>
                <strong>{account.title}</strong>
                <p>{account.detail}</p>
                <button type="button" className="pay-copy" onClick={() => copyNumber(account.number)}>
                  <b>{account.number}</b>
                  {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
                  {copied ? "Copied" : "Copy number"}
                </button>
              </div>
            )}
            <label>Your name<input value={customerName} onChange={(event) => setCustomerName(event.target.value)} autoComplete="name" /></label>
            <label>Your phone<input value={phone} onChange={(event) => setPhone(event.target.value)} inputMode="tel" autoComplete="tel" placeholder="03xxxxxxxxx" /></label>
            <label>Transaction ID<input value={transactionId} onChange={(event) => setTransactionId(event.target.value)} placeholder="From EasyPaisa, JazzCash, or your bank" /></label>
            <label className="pay-upload">
              Receipt photo
              <input type="file" accept="image/*" onChange={(event) => onReceipt(event.target.files?.[0])} />
              <span><Upload size={16} aria-hidden="true" />{receiptName || "Upload the payment slip"}</span>
            </label>
            {receiptDataUrl && <img className="pay-preview" src={receiptDataUrl} alt="Uploaded receipt preview" />}
            {error && <p className="pay-error">{error}</p>}
            <Button variant="hero" type="submit">Submit payment</Button>
          </form>
        )}
      </section>
    </div>
  );
}
