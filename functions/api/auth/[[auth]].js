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
        // ⭐ 수정된 네이버 설정: 안전한 데이터 추출 로직 적용
        naver: {
            clientId: env.NAVER_CLIENT_ID,
            clientSecret: env.NAVER_CLIENT_SECRET,
            mapUser: (user) => {
                // 구조가 다를 경우를 대비해 옵셔널 체이닝(?.)과 Fallback 객체 추가
                const res = user?.response || user || {};
                
                return {
                    // 값이 없을 경우 서버가 뻗지 않도록 임시값(Fallback) 지정
                    email: res?.email || `naver_${Date.now()}@temp.user`,
                    name: res?.name || res?.nickname || "네이버회원",
                    image: res?.profile_image || null,
                };
            },
        },

        kakao: {
            clientId: env.KAKAO_CLIENT_ID,
            clientSecret: env.KAKAO_CLIENT_SECRET,
            scope: ["profile_nickname"],
            // 이메일이 없을 경우를 대비해 고유 ID를 기반으로 임시 값을 넣거나 빈 값을 허용하게 합니다.
            mapUser: (user) => {
                return {
                    email: user.kakao_account?.email || `${user.id}@kakao.user`, // 이메일이 없으면 임시 이메일 생성
                    name: user.properties?.nickname || "카카오회원",
                };
            },
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