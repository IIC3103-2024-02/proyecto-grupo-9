'use server'
import { getSpaces } from "../space/get-spaces";
import { getSpaceProducts } from "../space/get-space-products";
import { moveProduct } from "../product/move-product";

export async function moveMany({ sku, quantity, storeId }: { sku: string, quantity: number, storeId: string }) {
    try {
        const spaces = await getSpaces();
        if (!spaces) {
            return {
                error: 'No se pudieron obtener los espacios'
            };
        }
        console.log('Moviendo productos de espacio...')
        let remainingQuantity = quantity;

        const moveProductsFromSpace = async (space: { id: any; name: string; totalSpace: number; usedSpace: number; skuCount: any; }) => {
            if (space.skuCount[sku] > 0 && storeId !== space.id) {
                console.log(`Hay productos en ${space.name}`);
                const products = await getSpaceProducts(space.id, sku);
                const moveCount = Math.min(remainingQuantity, products.length);
                for (let i = 0; i < moveCount; i++) {
                    await moveProduct(storeId, products[i]._id);
                    console.log('Moviendo producto ', products[i].sku);
                }
                remainingQuantity -= moveCount;
            }
        };

        await moveProductsFromSpace(spaces.buffer);
        await moveProductsFromSpace(spaces.checkIn);
        await moveProductsFromSpace(spaces.cold);
        await moveProductsFromSpace(spaces.kitchen);

        if (remainingQuantity === quantity) {
            console.log('No se pudieron mover los productos')
            return {
                error: 'No se pudieron mover todos los productos'
            };
        }
        

    } catch (error: any) {
        console.log(error.message);
        return null;
    }
}