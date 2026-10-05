export const paymentAccounts = [
  {
    id: "easypaisa",
    name: "EasyPaisa",
    title: "Saqib Haroon",
    number: "03165757901",
    detail: "EasyPaisa mobile account",
  },
  {
    id: "jazzcash",
    name: "JazzCash",
    title: "Saqib Haroon",
    number: "03165757901",
    detail: "JazzCash mobile account",
  },
  {
    id: "bank",
    name: "Bank account",
    title: "Saqib Haroon",
    number: "01234567890123",
    detail: "Meezan Bank",
  },
] as const;

export type PaymentId = (typeof paymentAccounts)[number]["id"];

export type CheckoutItem = {
  name: string;
  category: string;
  price: number;
  qty: number;
  image: string;
};

export type StoreOrder = {
  id: string;
  orderNumber: string;
  trackerNumber: string;
  method: PaymentId;
  accountTitle: string;
  accountNumber: string;
  customerName: string;
  phone: string;
  transactionId: string;
  receiptDataUrl: string;
  items: CheckoutItem[];
  total: number;
  status: "verifying" | "confirmed";
  createdAt: number;
  verifyAt: number;
};

const STORAGE_KEY = "luxora-orders";
export const VERIFY_DELAY_MS = 8000;

export const formatPrice = (amount: number) => `Rs. ${amount.toLocaleString("en-PK")}`;

const stamp = (prefix: string) => `${prefix}-${Math.floor(10000 + Math.random() * 90000)}`;

export function loadOrders(): StoreOrder[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as StoreOrder[]) : [];
    return promoteDue(parsed);
  } catch {
    return [];
  }
}

export function saveOrders(orders: StoreOrder[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

function promoteDue(orders: StoreOrder[]) {
  const now = Date.now();
  let changed = false;
  const next = orders.map((order) => {
    if (order.status === "verifying" && now >= order.verifyAt) {
      changed = true;
      return { ...order, status: "confirmed" as const };
    }
    return order;
  });
  if (changed) saveOrders(next);
  return next;
}

export function placeOrder(input: Omit<StoreOrder, "id" | "orderNumber" | "trackerNumber" | "status" | "createdAt" | "verifyAt">) {
  const now = Date.now();
  const order: StoreOrder = {
    ...input,
    id: crypto.randomUUID(),
    orderNumber: stamp("LX"),
    trackerNumber: stamp("TRK"),
    status: "verifying",
    createdAt: now,
    verifyAt: now + VERIFY_DELAY_MS,
  };
  saveOrders([order, ...loadOrders()]);
  return order;
}

export function readReceiptFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);
    image.onload = () => {
      const scale = Math.min(1, 900 / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      const context = canvas.getContext("2d");
      if (!context) {
        URL.revokeObjectURL(url);
        reject(new Error("Could not read that receipt."));
        return;
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.72));
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Upload a photo of the receipt."));
    };
    image.src = url;
  });
}
