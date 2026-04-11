// src/auth-client.js
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    // 현재 작동 중인 백엔드 주소
    baseURL: "http://127.0.0.1:8788" 
});