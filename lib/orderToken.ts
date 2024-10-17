'use server'

import axios from "axios";
import { jwtDecode } from 'jwt-decode';

let orderToken: string | null = null;
let orderTokenExpirationTime: number | undefined;

export async function getOrderToken() {
    try {
        if (!orderToken || (orderTokenExpirationTime && Date.now() / 1000 >= orderTokenExpirationTime)) {
            const url = process.env.API_URI;
            const secret = process.env.API_SECRET;
            const group = 9

            const requestBody = {
                "group": group,
                "secret": secret
            };

            const res = await axios.post(`${url}/ordenes-compra/autenticar`, 
                requestBody,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            const data = res.data;
            orderToken = data.token; // Store the token
            
            if (orderToken) {
                const decodedToken = jwtDecode(orderToken);
                orderTokenExpirationTime = decodedToken.exp
                // Print the decoded token
            }
        }
        if (!orderToken) {
            console.log('token not found')
        }
        return orderToken;
    } catch (error: any) {  
        console.log(error.message);
        return null;
    }
}