

export async function register () {
    if (process.env.NEXT_RUNTIME === "nodejs") {
        const { monitorDirectory } = await import("./lib/sftp");
        monitorDirectory('/pedidos');
    }
}