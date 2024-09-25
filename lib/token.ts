'use server'

import axios from "axios";
import { jwtDecode } from 'jwt-decode';

let token: string | null = null;
let tokenExpirationTime: number | undefined;

export async function fetchToken() {
    try {
        if (!token || (tokenExpirationTime && Date.now() / 1000 >= tokenExpirationTime)) {
            const url = process.env.API_URI;
            const secret = process.env.API_SECRET;
            const group = 9

            const requestBody = {
                "group": group,
                "secret": secret
            };

            const res = await axios.post(`${url}/auth`, 
                requestBody,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            const data = res.data;
            token = data.token; // Store the token
            
            if (token) {
                const decodedToken = jwtDecode(token);
                tokenExpirationTime = decodedToken.exp
                // Print the decoded token
            }
        }
        if (!token) {
            console.log('token not found')
        }
        return token;
    } catch (error: any) {  
        console.log(error.message);
        return null;
    }
}