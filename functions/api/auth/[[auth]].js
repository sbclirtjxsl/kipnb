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
            mapUser: (user) => {
                // 네이버는 응답 객체 안에 'response' 키로 데이터가 들어옵니다.
                const res = user.response;
                return {
                    email: res.email,
                    name: res.name || res.nickname,
                    image: res.profile_image,
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
                    name: user.properties.nickname,
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