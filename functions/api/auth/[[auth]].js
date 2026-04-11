import { betterAuth } from "better-auth";
import { D1Dialect } from "kysely-d1";

export const auth = (env) => betterAuth({
    database: {
        dialect: new D1Dialect({
            database: env.DB,
        }),
        type: "sqlite",
    },
    
    // ⭐ wrangler.toml에서 URL을 가져옵니다.
    baseURL: env.BETTER_AUTH_URL, 
    
    // 비밀키는 클라우드플레어 대시보드(Secret)에서 가져옵니다.
    secret: env.BETTER_AUTH_SECRET,
    
    socialProviders: {
        google: {
            // ⭐ wrangler.toml에서 아이디를 가져옵니다.
            clientId: env.GOOGLE_CLIENT_ID, 
            
            // 비밀번호는 클라우드플레어 대시보드(Secret)에서 가져옵니다.
            clientSecret: env.GOOGLE_CLIENT_SECRET, 
        },
    },
});

export async function onRequest(context) {
    const { env, request } = context;
    return auth(env).handler(request);
}