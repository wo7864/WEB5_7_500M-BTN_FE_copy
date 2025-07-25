import { loadTossPayments } from "@tosspayments/payment-sdk";

// 토스 페이먼츠 클라이언트 키 (테스트용)
const TOSS_CLIENT_KEY =
  process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY ||
  "test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq";

// 토스 페이먼츠 인스턴스 초기화
let tossPayments: any = null;

export const initializeTossPayments = async () => {
  if (!tossPayments) {
    try {
      tossPayments = await loadTossPayments(TOSS_CLIENT_KEY);
    } catch (error) {
      console.error("토스 페이먼츠 초기화 실패:", error);
      throw new Error("토스 페이먼츠를 초기화할 수 없습니다.");
    }
  }
  return tossPayments;
};

// 결제 요청 함수
export const requestPayment = async (paymentData: {
  amount: number;
  orderId: string;
  orderName: string;
  customerName: string;
  customerEmail: string;
}) => {
  const tossPayments = await initializeTossPayments();

  return new Promise((resolve, reject) => {
    tossPayments
      .requestPayment("카드", {
        amount: paymentData.amount,
        orderId: paymentData.orderId,
        orderName: paymentData.orderName,
        customerName: paymentData.customerName,
        customerEmail: paymentData.customerEmail,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      })
      .then((response: any) => {
        resolve(response);
      })
      .catch((error: any) => {
        reject(error);
      });
  });
};

// 결제 성공 페이지에서 결제 확인
export const confirmPayment = async (
  paymentKey: string,
  orderId: string,
  amount: number
) => {
  try {
    // 액세스 토큰 가져오기
    const accessToken = localStorage.getItem("accessToken");

    const response = await fetch("/api/payment/confirm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount,
      }),
    });

    if (!response.ok) {
      throw new Error("결제 확인에 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("결제 확인 실패:", error);
    throw error;
  }
};

// 결제 금액 포맷팅
export const formatAmount = (amount: number): string => {
  return amount.toLocaleString("ko-KR");
};

// 주문 ID 생성
export const generateOrderId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `order_${timestamp}_${random}`;
};
