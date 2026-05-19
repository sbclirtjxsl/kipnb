import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    // 현재 도메인 주소를 자동 감지하여 안정적으로 엔드포인트를 매핑합니다.
    baseURL: window.location.origin
});