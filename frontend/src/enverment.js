const server =
    import.meta.env.VITE_SERVER_URL ||
    (import.meta.env.PROD
        ? "https://genz-call-1.onrender.com"
        : "http://localhost:8000");

export default server;