import { betterAuth } from "better-auth";
import { D1Dialect } from "kysely-d1";

// 1. Better-auth 설정
export const auth = (env) => betterAuth({
    database: {
        dialect: new D1Dialect({ database: env.DB }),
        type: "sqlite",
    },
    
    // ⭐ 클라우드플레어 환경변수를 우선 사용하고, 없으면 로컬 주소 사용
    baseURL: env.BETTER_AUTH_URL || "http://127.0.0.1:8788",
    
    secret: env.BETTER_AUTH_SECRET,
    
    // 소셜 로그인 설정
    socialProviders: {
        google: {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
        },
    },
});

// 2. 핸들러
export async function onRequest(context) {
    const { env, request } = context;
    return auth(env).handler(request);
}