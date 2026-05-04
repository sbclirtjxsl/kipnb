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
    // ⭐ 이 부분을 추가합니다! (서버 로그 강제 출력)
    logger: {
        level: "debug"
    },
    socialProviders: {
        google: {
            clientId: env.GOOGLE_CLIENT_ID, 
            clientSecret: env.GOOGLE_CLIENT_SECRET, 
        },
        naver: {
            clientId: env.NAVER_CLIENT_ID,
            clientSecret: env.NAVER_CLIENT_SECRET,
        },
        kakao: {
            clientId: env.KAKAO_CLIENT_ID,
            clientSecret: env.KAKAO_CLIENT_SECRET,
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