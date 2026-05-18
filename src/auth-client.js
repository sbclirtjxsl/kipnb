import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    // 로컬 주소 대신, 현재 접속한 브라우저의 진짜 주소를 자동으로 감지하도록 변경!
    baseURL: window.location.origin,
    
    // 🛠️ 추가: 계정 연동 API가 404 에러 나지 않고 백엔드로 정확히 도달하도록 경로를 매핑합니다.
    advanced: {
        linkAccountPath: "/api/auth/account/link"
    }
});