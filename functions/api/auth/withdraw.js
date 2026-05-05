// functions/api/auth/withdraw.js

import { auth } from "./[[auth]]"; 

export async function onRequestPost(context) {
  const { env, request } = context;

  try {
    // ✅ 핵심 수정: auth(env)를 호출하여 실제 betterAuth 인스턴스를 생성합니다.
    const authInstance = auth(env);

    // ✅ 이제 정상적으로 인스턴스에서 세션을 가져올 수 있습니다.
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

    // 네이버 엑세스 토큰 확인 (DB 조회)
    const account = await env.DB.prepare(
      "SELECT access_token FROM account WHERE userId = ? AND providerId = 'naver' LIMIT 1"
    ).bind(userId).first();

    if (account?.access_token) {
      const naverRevokeUrl = `https://nid.naver.com/oauth2.0/token?grant_type=delete&client_id=${env.NAVER_CLIENT_ID}&client_secret=${env.NAVER_CLIENT_SECRET}&access_token=${account.access_token}&service_provider=NAVER`;
      
      await fetch(naverRevokeUrl);
    }

    // DB 데이터 삭제 (트랜잭션)
    const deleteQueries = [
      env.DB.prepare("DELETE FROM session WHERE userId = ?").bind(userId),
      env.DB.prepare("DELETE FROM account WHERE userId = ?").bind(userId),
      env.DB.prepare("DELETE FROM user WHERE id = ?").bind(userId)
    ];
    
    await env.DB.batch(deleteQueries);

    return new Response(JSON.stringify({ message: "탈퇴가 성공적으로 처리되었습니다." }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Withdraw Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}