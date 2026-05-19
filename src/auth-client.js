// src/auth-client.js
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: window.location.origin,
    // 💡 advanced 객체는 완전히 지워주세요! SDK가 알아서 올바른 길을 찾습니다.
});