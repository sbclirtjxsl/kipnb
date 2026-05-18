import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: window.location.origin,
    advanced: {
        // 💡 link-account 요청이 백엔드 [[auth]].js로 통째로 넘어가도록 강제 유도합니다.
        linkAccountPath: "/api/auth/link-account"
    }
});