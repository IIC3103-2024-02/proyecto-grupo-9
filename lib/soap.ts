
import { BankStatementResult, BankStatement, GetInvoicesArgs, BillingDetails, BillingDetailsResult } from '@/types/soapApi';
import soap, { WSSecurity, createClientAsync} from 'soap';

const WSDL_URL = `${process.env.API_URI}/soap/billing?wsdl`;
const API_SECRET = process.env.API_SECRET || '';
const API_USER = '9'
var wsSecurity = new WSSecurity(API_USER, API_SECRET);

export async function getBankStatementAsync(): Promise<BankStatement> {
    try {
        const client = await createSoapClient(WSDL_URL);
        client.setSecurity(wsSecurity);

        const result: BankStatementResult = await new Promise((resolve, reject) => {
            client.getBankStatement({}, (err: any, result: BankStatementResult) => {
                if (err) {
                    reject(err); // Handle SOAP operation error
                } else {
                    resolve(result);
                }
            });
        });

        // Assuming result has the format { BankStatement: { group: string, balance: number } }
        return result.BankStatement; // Return the BankStatement directly
    } catch (error) {
        throw error; // Rethrow the error for the caller to handle
    }
}


export async function getInvoicesAsync({status, side, fromDate, toDate} : GetInvoicesArgs) : Promise<BillingDetails[]> {
    try {
        const client = await createSoapClient(WSDL_URL);
        client.setSecurity(wsSecurity);

        const result: BillingDetails[] = await new Promise((resolve, reject) => {
            client.getInvoices({status, side, fromDate, toDate}, (err: any, result: { BillingDetails: BillingDetails[]}) => {
                if (err) {
                    reject(err); // Handle SOAP operation error
                } else {
                    resolve(result.BillingDetails);
                }
            });
        });

        return result; // Return the BillingDetails array directly
    } catch (error) {
        throw error; // Rethrow the error for the caller to handle
    }
}

export async function emitInvoiceAsync(orderId: string): Promise<BillingDetails> {
    try {
        const client = await createSoapClient(WSDL_URL);
        client.setSecurity(wsSecurity);

        const result: BillingDetails = await new Promise((resolve, reject) => {
            client.emitInvoice({order_id: orderId}, (err: any, result: BillingDetailsResult) => {
                if (err) {
                    reject(err); // Handle SOAP operation error
                } else {
                    resolve(result.BillingDetails);
                }
            });
        });

        return result; // Return the BillingDetails directly
    } catch (error) {
        throw error; // Rethrow the error for the caller to handle
    }
}

export async function payInvoiceAsync(invoiceId: string): Promise<BillingDetails> {
    try {
        const client = await createSoapClient(WSDL_URL);
        client.setSecurity(wsSecurity);

        const result: BillingDetails = await new Promise((resolve, reject) => {
            client.payInvoice({invoice_id: invoiceId}, (err: any, result: BillingDetails) => {
                if (err) {
                    reject(err); // Handle SOAP operation error
                } else {
                    resolve(result);
                }
            });
        });

        return result; // Return the BillingDetails directly
    } catch (error) {
        throw error; // Rethrow the error for the caller to handle
    }
}

function createSoapClient(url: string): Promise<soap.Client> {
    return createClientAsync(url);
}
