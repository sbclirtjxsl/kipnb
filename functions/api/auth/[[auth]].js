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
            // ⭐️ 클라우드플레어 환경에서 통신 성공률을 높이기 위한 옵션
            fetchOptions: {
                headers: {
                    'User-Agent': 'KIPNB-Auth-Client/1.0', // 봇 차단 방지
                }
            }
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
    // ⭐️ 에러 발생 시 숨기지 않고 강제로 로그에 찍어버리는 훅(Hook)
    hooks: {
        after: async (context) => {
            if (context.response instanceof Response && !context.response.ok) {
                try {
                    const errorText = await context.response.clone().text();
                    console.error("[BETTER-AUTH CRITICAL ERROR]:", context.response.status, errorText);
                } catch (e) {
                    console.error("[BETTER-AUTH CRITICAL ERROR]: Could not parse error response", e);
                }
            }
        }
    }
});

export async function onRequest(context) {
    const { env, request } = context;
    try {
        return await auth(env).handler(request);
    } catch (error) {
        // 가장 바깥쪽에서 서버가 죽는 에러를 잡습니다.
        console.error("[FATAL SERVER ERROR]:", error);
        return new Response(JSON.stringify({ error: "Fatal Server Error", details: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}