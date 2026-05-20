// functions/api/auth/unlink.js
import { auth } from "./[[auth]]"; 

export async function onRequestPost(context) {
  const { env, request } = context;

  try {
    const authInstance = auth(env);

    // 1. 현재 로그인된 사용자의 세션 검증
    const session = await authInstance.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return new Response(JSON.stringify({ error: "로그인이 필요합니다." }), { 
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const userId = session.user.id;
    
    // 2. 프론트엔드로부터 어떤 소셜(google, naver 등)을 끊을지 받기
    const { providerId } = await request.json();
    if (!providerId) {
      return new Response(JSON.stringify({ error: "해제할 소셜 공급자 정보가 없습니다." }), { status: 400 });
    }

    // 3. 🚨 [보안 방어] 만약 네이버 연동을 해제하는 경우, 네이버 OAuth 서버에도 연동 해제 토큰 통보 처리
    if (providerId === 'naver') {
      const account = await env.DB.prepare(
        "SELECT accessToken FROM account WHERE userId = ? AND providerId = 'naver' LIMIT 1"
      ).bind(userId).first();

      if (account?.accessToken) {
        const naverRevokeUrl = `https://nid.naver.com/oauth2.0/token?grant_type=delete&client_id=${env.NAVER_CLIENT_ID}&client_secret=${env.NAVER_CLIENT_SECRET}&access_token=${account.accessToken}&service_provider=NAVER`;
        await fetch(naverRevokeUrl);
      }
    }

    // 4. 🔥 D1 데이터베이스에서 해당 유저의 핀포인트 소셜 계정 행(account)만 삭제!
    await env.DB.prepare(
      "DELETE FROM account WHERE userId = ? AND providerId = ?"
    ).bind(userId, providerId).run();

    return new Response(JSON.stringify({ success: true, message: `${providerId} 연동이 해제되었습니다.` }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Unlink Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}