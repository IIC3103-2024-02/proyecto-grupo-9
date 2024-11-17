import { BankStatementResult, BankStatement, GetInvoicesArgs, BillingDetails } from '@/types/soapApi';
import soap from 'soap';

const WSDL_URL = `${process.env.API_URI}/soap/billing?wsdl`;
const API_SECRET = process.env.API_SECRET || '';
const API_USER = '9'
var wsSecurity = new soap.WSSecurity(API_USER, API_SECRET);

export function getBankStatementAsync(): Promise<BankStatement> {
    return new Promise((resolve, reject) => {
        soap.createClient(WSDL_URL, {}, function(err, client) {
            if (err) {
                return reject(err); // Handle client creation error
            }

            client.setSecurity(wsSecurity);

            console.log("This client has the following operations:");
            console.log(client.describe());
            console.log("\n");

            console.log("Calling getBankStatement operation:");
            client.getBankStatement({}, function(err: any, result: BankStatementResult) {
                if (err) {
                    return reject(err); // Handle SOAP operation error
                }

                // Assuming result has the format { BankStatement: { group: string, balance: number } }
                resolve(result.BankStatement); // Resolve with the BankStatement directly
            });
        });
    });
}

export function getInvoicesAsync({status, side, fromDate, toDate} : GetInvoicesArgs) : Promise<BillingDetails[]> {
    return new Promise((resolve, reject) => {
        soap.createClient(WSDL_URL, {}, function(err, client) {
            if (err) {
                return reject(err); // Reject if there's an error creating the client
            }

            client.setSecurity(wsSecurity);

            const getInvoicesArgs = {
                status,
                side,
                fromDate,
                toDate
            };

            console.log("Calling getInvoices operation:");
            client.getInvoices(getInvoicesArgs, function(err: any, result: any) {
                if (err) {
                    return reject(err); // Reject if there is an error in the SOAP call
                }

                if (result && result.BillingDetails) {
                    resolve(result.BillingDetails); // Resolve with BillingDetails
                } else {
                    resolve([]); // Resolve with an empty array if no BillingDetails
                }
            });
        });
    });
};

export function emitInvoiceAsync(orderId: string): Promise<BillingDetails> {
    return new Promise((resolve, reject) => {
        soap.createClient(WSDL_URL, {}, function(err, client) {
            if (err) {
                return reject(err); // Reject if there's an error creating the client
            }

            client.setSecurity(wsSecurity);

            const emitInvoiceArgs = {
                order_id: orderId
            };

            console.log("Calling emitInvoice operation:");
            client.emitInvoice(emitInvoiceArgs, function(err: any, result: any) {
                if (err) {
                    return reject(err); // Reject if there is an error in the SOAP call
                }

                resolve(result.BillingDetails); // Resolve with the result of the operation
            });
        });
    });
}

export function payInvoiceAsync(invoiceId: string): Promise<BillingDetails> {
    return new Promise((resolve, reject) => {
        soap.createClient(WSDL_URL, {}, function(err, client) {
            if (err) {
                return reject(err); // Reject if there's an error creating the client
            }

            client.setSecurity(wsSecurity);

            const payInvoiceArgs = {
                invoice_id: invoiceId
            };

            console.log("Calling payInvoice operation:");
            client.payInvoice(payInvoiceArgs, function(err: any, result: any) {
                if (err) {
                    return reject(err); // Reject if there is an error in the SOAP call
                }

                resolve(result.BillingDetails); // Resolve with the result of the operation
            });
        });
    });
}


