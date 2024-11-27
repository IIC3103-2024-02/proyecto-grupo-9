

export async function register () {
    if (process.env.NEXT_RUNTIME === "nodejs") {
        const { monitorDirectory } = await import("./lib/sftp");
        const { startBalanceSavingInterval } = await import("./actions/invoice/balance-interval");
        // const { startStockCheckInterval } = await import("./actions/order/stock-up");
        // const { getProducts } = await import("./actions/product/get-products");
        monitorDirectory('/pedidos');
        startBalanceSavingInterval()
        // startStockCheckInterval(20);
        // await getProducts();
    }
}