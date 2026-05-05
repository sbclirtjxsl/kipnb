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

    // 1. 요청이 들어왔을 때 서버 로그에 기록
    console.log(`[AUTH API START]: ${request.method} ${request.url}`);

    // 2. better-auth 실행
    const response = await auth(env).handler(request);

    // 3. 만약 better-auth가 실패(에러)를 반환했다면, 그 이유를 서버 로그에 강제로 기록
    if (!response.ok) {
        try {
            const errorText = await response.clone().text();
            console.error(`[AUTH CRITICAL ERROR]: Status ${response.status} | Details: ${errorText}`);
        } catch (e) {
            console.error(`[AUTH CRITICAL ERROR]: 로그 추출 실패`);
        }
    }

    return response;
}