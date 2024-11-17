
export interface BankStatement {
    group: string;
    balance: number;
  }
  
export interface BankStatementResult {
BankStatement: BankStatement;
}

export interface GetInvoicesArgs {
    status: 'pending' | 'paid';
    side: 'client' | 'supplier';
    fromDate: string;
    toDate: string;
}

export interface BillingDetails {
    id: string;
    client: string;
    supplier: string;
    channel: string;
    status: string;
    price: number;
    interest: number;
    createdAt: string;
    updatedAt: string;
}

