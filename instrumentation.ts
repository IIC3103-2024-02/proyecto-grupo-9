

export async function register () {
    if (process.env.NEXT_RUNTIME === "nodejs") {
        const { monitorDirectory } = await import("./lib/sftp");
        const { startStockCheckInterval } = await import("./actions/manuel/stock-up2");
        monitorDirectory('/pedidos');
        startStockCheckInterval(60);
    }
}