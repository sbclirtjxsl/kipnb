import { betterAuth } from "better-auth";
import { D1Dialect } from "kysely-d1";

// 1. Better-auth 설정
export const auth = (env) => betterAuth({
    database: {
        // ⭐ 여기가 핵심입니다! 글자가 아니라 Kysely D1 객체를 정확히 넣어줍니다.
        dialect: new D1Dialect({
            database: env.DB,
        }),
        type: "sqlite",
    },
    
    // 길 잃음 방지 (아까 경고 해결완료)
    baseURL: "http://127.0.0.1:8788",
    
    // 보안 비밀키 (아까 경고 해결완료)
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