// functions/api/auth/[[auth]].js
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
            // ✅ 추가: 네이버에서 받아온 프로필 데이터를 내 세션 필드에 매핑합니다.
            mapProfileToUser: (profile) => {
                return {
                    name: profile.response.name,
                    email: profile.response.email,
                    image: profile.response.profile_image,
                    mobile: profile.response.mobile,      // 010-0000-0000 형태
                    gender: profile.response.gender,      // M, F, U
                    birthday: profile.response.birthday,  // 10-01 형태
                    birthyear: profile.response.birthyear // 1990 형태
                };
            }
        },
        kakao: {
            clientId: env.KAKAO_CLIENT_ID,
            clientSecret: env.KAKAO_CLIENT_SECRET,
        },
    },
    user: {
        // ✅ 추가: 세션 객체와 데이터베이스에 저장될 추가 필드들을 정의합니다.
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "일반 회원" 
            },
            mobile: {
                type: "string",
                required: false,
            },
            gender: {
                type: "string",
                required: false,
            },
            birthday: {
                type: "string",
                required: false,
            },
            birthyear: {
                type: "string",
                required: false,
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