'use server'

import { space } from "postcss/lib/list";
import { getSpaces } from "../space/get-spaces";
import Order from "@/models/Order";
import { requestProducts } from "../product/request-products";

export async function stockUp() {
    console.log('Revisando stock');
    const orders = await Order.find();
    const n_order = orders.length;
    const spaces = await getSpaces();
    if (!spaces) {
        return {
            error: 'No se pudieron obtener los espacios'
        };
    }
    if (spaces.checkIn.skuCount['CAFEGRANO'] + spaces.buffer.skuCount['CAFEGRANO'] < 30) {
        CheckCoffee(n_order);
    }
    if (spaces.checkIn.skuCount['LECHEENTERA'] + spaces.buffer.skuCount['LECHEENTERA'] < 30) {
        CheckMilk(n_order);
    }
    if (spaces.checkIn.skuCount['AZUCARSACHET'] + spaces.buffer.skuCount['AZUCARSACHET'] < 30) {
        CheckSugar(n_order);
    }
    if (spaces.checkIn.skuCount['ENDULZANTESACHET'] + spaces.buffer.skuCount['ENDULZANTESACHET'] < 30) {
        CheckSweetener(n_order);
    }
    if (spaces.checkIn.skuCount['VASOCAFE'] + spaces.buffer.skuCount['VASOCAFE'] < 60) {
        CheckCoffeeCup(n_order);
    }
    if (spaces.checkIn.skuCount['VASOCAFEDOBLE'] + spaces.buffer.skuCount['VASOCAFEDOBLE'] < 60) {
        CheckDoubleCoffeeCup(n_order);
    }
    if (spaces.checkIn.skuCount['VASOCAFEEXPRESSO'] + spaces.buffer.skuCount['VASOCAFEEXPRESSO'] < 60) {
        CheckExpressoCup(n_order);
    }
}

async function CheckCoffee(order: number) {
    if (order % 15 === 0) {
        requestProducts({ sku: 'CAFEGRANO', quantity: 20 });
    }
}

async function CheckMilk(order: number) {
    if (order % 10 === 0) {
        requestProducts({ sku: 'LECHEENTERA', quantity: 12 });
    }
}

async function CheckSugar(order: number) {
    if (order % 15 === 0) {
        requestProducts({ sku: 'AZUCARSACHET', quantity: 100 });
    }
}

async function CheckSweetener(order: number) {
    if (order % 24 === 0) {
        requestProducts({ sku: 'ENDULZANTESACHET', quantity: 100 });
    }
}

async function CheckCoffeeCup(order: number) {
    if (order % 15 === 0) {
        requestProducts({ sku: 'VASOCAFE', quantity: 100 });
    }
}

async function CheckDoubleCoffeeCup(order: number) {
    if (order % 20 === 0) {
        requestProducts({ sku: 'VASOCAFEDOBLE', quantity: 80 });
    }
}

async function CheckExpressoCup(order: number) {
    if (order % 15 === 0) {
        requestProducts({ sku: 'VASOCAFEEXPRESSO', quantity: 120 });
    }
}
