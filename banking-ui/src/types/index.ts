// ─── Enums ────────────────────────────────────────────────────────────────────

export enum AccountType {
  Checking = "Checking",
  Savings  = "Savings",
  Credit   = "Credit",
}

export enum Currency {
  USD = "USD",
  EUR = "EUR",
  GBP = "GBP",
  LTL = "LTL",
}

export enum TransactionType {
  Deposit    = "Deposit",
  Withdrawal = "Withdrawal",
  Transfer   = "Transfer",
}

export enum TransactionStatus {
  Completed = "Completed",
  Failed    = "Failed",
  Pending   = "Pending",
}

// ─── Response DTOs (mirror C# *ResponseDto) ──────────────────────────────────

export interface UserResponse {
  userId:           number;
  fullName:          string;
  dateOfBirth:       string;       // ISO date
  phoneNumber:       string | null;
  email:             string | null;
  address:           string | null;
  userName:          string;
  twoFactorEnabled:  boolean;
  isActive:          boolean;
  createdAt:         string;       // ISO datetime
}

export interface AccountResponse {
  accountId:     number;
  accountNumber: number;
  accountType:   AccountType;
  balance:       number;
  currency:      Currency;
  isActive:      boolean;
  createdAt:     string;
}

export interface TransactionResponse {
  transactionId: number;
  fromAccountId: number;
  toAccountId:   number | null;
  amount:        number;
  currency:      Currency;
  transactionType: TransactionType;
  status:        TransactionStatus;
  createdAt:     string;
  balanceAfter:  number;
  description:   string | null;
}

// ─── Create / Update DTOs (mirror C# *CreateDto / *UpdateDto) ─────────────────

export interface UserCreateDto {
  fullName:    string;
  dateOfBirth: string;
  userName:    string;
  email:       string;
  phoneNumber: string;
  address:     string;
  password:    string;
}

export interface UserUpdateDto {
  phoneNumber?: string;
  email?:       string;
  address?:     string;
  userName?:    string;
}

export interface AccountCreateDto {
  userId:        number;
  accountType:    AccountType;
  currency:       Currency;
  initialDeposit: number;
}

export interface AccountUpdateDto {
  isActive: boolean;
}

export interface TransactionCreateDto {
  fromAccountId:  number;
  toAccountId?:   number;
  amount:         number;
  transactionType: TransactionType;
  description?:   string;
}

// ─── App-level / UI types ─────────────────────────────────────────────────────

export type AppRoute =
  | "start"
  | "login"
  | "register"
  | "dashboard"
  | "accounts"
  | "account-detail"
  | "transactions"
  | "profile";
