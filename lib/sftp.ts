'use server'

import sleep from '@/actions/order/cooking';
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
        await checkDirectory(remoteDir);
        await sftp.end();
        setInterval(async () => {
            await sftp.connect(config);
            await checkDirectory(remoteDir);
            await sftp.end();
        }, 5 * 60 * 1000); // Poll directory every 5 minutes
    } catch (error) {
        console.error('SFTP connection error:', error);
        await sftp.end();
        /* monitorDirectory(remoteDir); */
    }
}

async function checkDirectory(remoteDir: string) {
    const files = await sftp.list(remoteDir) as SFTPFile[];
    console.log(`Checking ${files.length} files in ${remoteDir}`);

    const filteredFiles = files.filter(file => !file.name.includes('cache'));

    for (const file of filteredFiles) {
    // for (const file of files) {
        // console.log(`******* Processing file ${file.name} ********`);
        const content = await getFileContent(`${remoteDir}/${file.name}`);
        if (content) {
            const parsedContent = await parseStringPromise(content, { explicitArray: false });
            const order = await getOrder({ orderId: parsedContent.order.id });

            if (order?.estado === 'vencida' || order?.estado === 'cumplida' || order?.estado === 'anulada' || order?.estado === 'rechazada') {
                /* console.log(`Order ${order.id} has expired. Deleting file ${file.name}`); */
                await sftp.delete(`${remoteDir}/${file.name}`);
            } else if (order?.estado === 'creada') {
                console.log(`Orden ${order.id} creada. Enviando a la API...`);
                await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
                    id: order.id,
                    order: parsedContent.order.sku,
                    dueDate: order.vencimiento
                })
                await sleep(30*1000); // 30 seconds
                /* console.log(`Order ${order?.id} has been sended to the API`); */
            }
        }
    }
    console.log('Polling directory again in 5 minutes...');
}