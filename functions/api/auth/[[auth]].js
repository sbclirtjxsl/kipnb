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
    },

    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "일반 회원" 
            }
        }
    },

    // ⭐ 브라우저 종료 시 자동 로그아웃(세션 쿠키) 설정 추가!
    advanced: {
        cookies: {
            session_token: { // 버전 1.6+ 기준 (또는 sessionToken)
                attributes: {
                    maxAge: null 
                }
            }
        }
    }
});

export async function onRequest(context) {
    const { env, request } = context;
    return auth(env).handler(request);
}