import { betterAuth } from "better-auth";
import { D1Dialect } from "kysely-d1";

export const auth = (env) => betterAuth({
    database: {
        dialect: new D1Dialect({
            database: env.DB,
        }),
        type: "sqlite",
    },
    baseURL: env.BETTER_AUTH_URL, 
    secret: env.BETTER_AUTH_SECRET,
    socialProviders: {
        google: {
            clientId: env.GOOGLE_CLIENT_ID, 
            clientSecret: env.GOOGLE_CLIENT_SECRET, 
        },
        // ⭐ 네이버 설정을 여기에 추가합니다.
        naver: {
            clientId: env.NAVER_CLIENT_ID,
            clientSecret: env.NAVER_CLIENT_SECRET,
        },
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "일반 회원" 
            }
        }
    }
});

export async function onRequest(context) {
    const { env, request } = context;
    return auth(env).handler(request);
}