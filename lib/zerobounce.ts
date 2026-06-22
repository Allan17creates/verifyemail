import type { VerificationResult } from "@/types";

interface ZeroBounceResponse {
  address: string;
  status: string; // valid | invalid | catch-all | unknown | spamtrap | abuse | do_not_mail
  sub_status: string;
  domain: string;
  mx_found: string; // "true" | "false"
  mx_record: string;
  smtp_provider: string;
  did_you_mean: string;
}

const SUB_STATUS_REASONS: Record<string, string> = {
  antispam_system: "Blocked by the recipient's spam filter.",
  greylisted: "Mail server temporarily deferred verification.",
  mail_server_temporary_error: "Mail server returned a temporary error.",
  forcible_disconnect: "Mail server disconnected during verification.",
  mail_server_did_not_respond: "Mail server didn't respond in time.",
  timeout_exceeded: "Verification timed out.",
  failed_smtp_connection: "Couldn't connect to the mail server.",
  mailbox_quota_exceeded: "Mailbox is full.",
  exception_occurred: "Verification failed unexpectedly.",
  possible_typo: "Domain may contain a typo.",
  unroutable_ip_address: "Mail server IP is unroutable.",
  leading_period_removed: "Email had a leading period removed.",
  does_not_accept_mail: "Domain does not accept mail.",
  alias_address: "This is an alias address.",
  role_based: "This is a role-based address (e.g. info@, support@).",
  global_suppression: "Address is on a global suppression list.",
  mailbox_not_found: "Mailbox does not exist.",
  no_dns_entries: "Domain has no DNS entries.",
  failed_syntax_check: "Email failed basic syntax validation.",
  possible_trap: "Address may be a spam trap.",
  toxic: "Address is flagged as toxic / high risk.",
  disposable: "This is a disposable / temporary email address.",
  role_based_catch_all: "Role-based address on a catch-all domain.",
  global_suppression_catch_all: "Address suppressed on a catch-all domain.",
};

function transform(data: ZeroBounceResponse): VerificationResult {
  const disposable = data.sub_status === "disposable";
  const mxFound = data.mx_found === "true";

  let result: VerificationResult["result"] = "risky";
  let risk: VerificationResult["risk"] = "medium";

  switch (data.status) {
    case "valid":
      result = "valid";
      risk = "low";
      break;
    case "invalid":
      result = "invalid";
      risk = "high";
      break;
    case "catch-all":
    case "unknown":
      result = "risky";
      risk = "medium";
      break;
    case "spamtrap":
    case "abuse":
    case "do_not_mail":
      result = "risky";
      risk = "high";
      break;
    default:
      result = "risky";
      risk = "medium";
  }

  const reason =
    SUB_STATUS_REASONS[data.sub_status] ??
    (result === "valid"
      ? "Mailbox confirmed and accepting mail."
      : result === "invalid"
        ? "Mailbox does not exist or domain is invalid."
        : "Could not fully confirm this mailbox.");

  return {
    result,
    email: data.address,
    reason,
    risk,
    domain: data.domain,
    disposable,
    mx_found: mxFound,
    mx_record: data.mx_record || undefined,
    did_you_mean: data.did_you_mean || undefined,
  };
}

export async function verifyEmail(email: string): Promise<VerificationResult> {
  const apiKey = process.env.ZEROBOUNCE_API_KEY;
  if (!apiKey) {
    throw new Error("ZEROBOUNCE_API_KEY is not configured");
  }

  const url = new URL("https://api.zerobounce.net/v2/validate");
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("email", email);
  url.searchParams.set("ip_address", "");

  const res = await fetch(url.toString(), { method: "GET" });

  if (!res.ok) {
    throw new Error(`ZeroBounce request failed with status ${res.status}`);
  }

  const data = (await res.json()) as ZeroBounceResponse;
  return transform(data);
}
