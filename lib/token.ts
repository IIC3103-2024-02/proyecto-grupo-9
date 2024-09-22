'use server'

import axios from "axios";

let token: string | null = null;
let tokenExpirationTime: number | null = null;

export async function fetchToken() {
    try {
        if (!token) {
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
        }
        console.log('token', token);
        return token;
    } catch (error: any) {  
        console.log(error.message);
        return null;
    }
}