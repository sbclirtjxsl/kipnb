import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    // 로컬 주소 대신, 현재 접속한 브라우저의 진짜 주소를 자동으로 감지하도록 변경!
    baseURL: window.location.origin 
});