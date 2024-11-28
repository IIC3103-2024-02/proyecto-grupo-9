

export async function register () {
    if (process.env.NEXT_RUNTIME === "nodejs") {
        const { monitorDirectory } = await import("./lib/sftp");
        // const { startStockCheckInterval } = await import("./actions/order/stock-up");
        // const { getProducts } = await import("./actions/product/get-products");
        monitorDirectory('/pedidos');
        // startStockCheckInterval(20);
        // await getProducts();
    }
}