declare global {
    const MAIN_WINDOW_VITE_DEV_SERVER_URL: string | undefined; // URL might not exist in prod builds
    const MAIN_WINDOW_VITE_NAME: string;
}

export {};