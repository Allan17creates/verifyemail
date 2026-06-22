export type VerificationStatus = "valid" | "invalid" | "risky";
export type RiskLevel = "low" | "medium" | "high";

export interface VerificationResult {
  result: VerificationStatus;
  email: string;
  reason: string;
  risk: RiskLevel;
  domain: string;
  disposable: boolean;
  mx_found?: boolean;
  mx_record?: string;
  did_you_mean?: string;
}

export interface Profile {
  id: string;
  email: string;
  credits: number;
  created_at: string;
}

export interface CreditPurchase {
  id: string;
  user_id: string;
  stripe_payment_id: string | null;
  credits_added: number;
  amount_paid: number;
  pack_name: string;
  created_at: string;
}

export type BulkJobStatus = "pending" | "processing" | "complete" | "failed";

export interface BulkJob {
  id: string;
  user_id: string;
  file_name: string;
  total_emails: number;
  processed: number;
  valid_count: number;
  invalid_count: number;
  risky_count: number;
  status: BulkJobStatus;
  report_path: string | null;
  credits_used: number;
  created_at: string;
  completed_at: string | null;
}

export interface VerificationRow {
  id: string;
  job_id: string;
  email: string;
  status: VerificationStatus;
  reason: string;
  risk_level: RiskLevel;
  domain: string;
  disposable: boolean;
  mx_found: boolean;
  created_at: string;
}

export interface CreditPack {
  id: "starter" | "growth" | "pro" | "business";
  name: string;
  credits: number;
  price: number; // in dollars
  priceId: string; // stripe price id env lookup key
}

export const CREDIT_PACKS: CreditPack[] = [
  { id: "starter", name: "Starter", credits: 100, price: 3, priceId: "STRIPE_PRICE_STARTER" },
  { id: "growth", name: "Growth", credits: 500, price: 12, priceId: "STRIPE_PRICE_GROWTH" },
  { id: "pro", name: "Pro", credits: 2000, price: 39, priceId: "STRIPE_PRICE_PRO" },
  { id: "business", name: "Business", credits: 10000, price: 149, priceId: "STRIPE_PRICE_BUSINESS" },
];
