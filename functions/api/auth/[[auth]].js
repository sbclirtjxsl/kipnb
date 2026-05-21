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
    },
    account: {
        accountLinking: {
            enabled: true,
            allowDifferentEmails: true, 
            // 🌟 추가된 핵심 코드: 이메일 인증 마크가 없어도 무조건 연동을 허용할 소셜 공급자 명시
            trustedProviders: ["google", "naver", "kakao"]
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

    // 🌟 [추가된 핵심 세션 방어 코드]: 소셜 로그인 완료 콜백 및 세션 체크 시 
    // 브라우저가 옛날 인증 상태 캐시를 들고 "로그인 전" 화면을 그리는 버그를 원천 차단합니다.
    if (request.url.includes("/callback") || request.url.includes("/session")) {
        const newResponse = new Response(response.body, response);
        newResponse.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
        newResponse.headers.set("Pragma", "no-cache");
        newResponse.headers.set("Expires", "0");
        return newResponse;
    }

    return response;
}