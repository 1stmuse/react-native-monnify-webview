export interface IncomeSplitConfig {
  subAccountCode?: string;
  feePercentage?: number;
  splitAmount?: number;
  feeBearer?: boolean;
}

export type PAYMENT_METHOD =
  | 'CARD'
  | 'ACCOUNT_TRANSFER'
  | 'USSD'
  | 'PHONE_NUMBER';

export interface CheckoutParams {
  amount: number;
  currency?: string;
  reference?: string;
  customerFullName: string;
  customerEmail: string;
  contractCode: string;
  paymentMethods?: PAYMENT_METHOD[];
  paymentDescription?: string;
  metadata?: Record<string, unknown>;
  incomeSplitConfig?: IncomeSplitConfig[];
}

export enum PAYSTATUS {
  PAID = 'PAID',
  USER_CANCELLED = 'USER_CANCELLED',
}

export interface MonnifyWebViewParams {
  checkoutParams: CheckoutParams;
  onSuccess: (data: ResponseObject) => void;
  onClose: (data: CloseEvent | null) => void;
  onError: (data: WebSocketMessageEvent & { message: string }) => void;
}

export interface CloseEvent {
  authorizedAmount: number;
  paymentStatus: PAYSTATUS;
  redirectUrl: string | null;
  responseCode: PAYSTATUS;
  responseMessage: string;
}

export interface ResponseObject {
  amount: number;
  amountPaid: number;
  completed: boolean;
  completedOn: string;
  createdOn: string;
  currencyCode: string;
  customerEmail: string;
  customerName: string;
  fee: number;
  metaData?: Record<string, unknown>;
  payableAmount: number;
  paymentMethod: string;
  paymentReference: string;
  paymentStatus: PAYSTATUS;
  transactionReference: string;
}
