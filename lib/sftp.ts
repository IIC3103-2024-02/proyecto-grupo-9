'use server'

import sleep from '@/actions/order/coffee-preparacion';
import { getOrder } from '@/actions/purchaseOrder/get-order';
import axios from 'axios';
import Client from 'ssh2-sftp-client';
import { parseStringPromise } from 'xml2js';

const sftp = new Client();


interface SFTPFile {
name: string;
size: number;
modifyTime: number;
}

const config = {
    host: process.env.SFTP_URL,
    username: process.env.SFTP_USER,
    password: process.env.SFTP_PASSWORD
};


async function getFileContent(remotePath: string): Promise<string | null> {
    try {
        const content = await sftp.get(remotePath);
        return content.toString(); // Convert Buffer to string
    } catch (error) {
        console.error('Error retrieving file content');
        return null;
    }
}
  
export async function monitorDirectory(remoteDir: string): Promise<void> {
    try {
        await sftp.connect(config);
        console.log('Connected to SFTP server.');
        
        await checkDirectory(remoteDir);
  
        setInterval(async () => {
            await checkDirectory(remoteDir);
        }, 20 * 60 * 1000); // Poll directory every 5 minutes
    } catch (error) {
        console.error('SFTP connection error:', error);
    }
}

async function checkDirectory(remoteDir: string) {
    const files = await sftp.list(remoteDir) as SFTPFile[];
    console.log(`Checking ${files.length} files in ${remoteDir}`);

    for (const file of files) {
        const content = await getFileContent(`${remoteDir}/${file.name}`);
        if (content) {
            const parsedContent = await parseStringPromise(content, { explicitArray: false });
            const order = await getOrder({ orderId: parsedContent.order.id });

            if (order?.estado === 'vencida') {
                /* console.log(`Order ${order.id} has expired. Deleting file ${file.name}`); */
                await sftp.delete(`${remoteDir}/${file.name}`);
            } else if (order?.estado === 'creada') {
                await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
                    id: order.id,
                    order: parsedContent.order.sku,
                    dueDate: order.vencimiento
                })
                await sleep(20000);
                /* console.log(`Order ${order?.id} has been sended to the API`); */
            } else {
                /* console.log(`Order ${order?.id} has already been processed`); */
            }
        }
    }
    console.log('Polling directory again in 20 minutes...');
}