// functions/api/auth/withdraw.js

// 1. 같은 폴더에 있는 [[auth]].js 파일로부터 auth 객체를 가져옵니다.
import { auth } from "./[[auth]]"; 

export async function onRequestPost(context) {
  const { env, request } = context;

  try {
    // 2. 이제 정상적으로 세션을 가져올 수 있습니다.
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return new Response(JSON.stringify({ error: "로그인이 필요합니다." }), { 
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const userId = session.user.id;

    // 3. 네이버 엑세스 토큰 확인 (DB 조회)
    const account = await env.DB.prepare(
      "SELECT access_token FROM account WHERE userId = ? AND providerId = 'naver' LIMIT 1"
    ).bind(userId).first();

    if (account?.access_token) {
      const naverRevokeUrl = `https://nid.naver.com/oauth2.0/token?grant_type=delete&client_id=${env.NAVER_CLIENT_ID}&client_secret=${env.NAVER_CLIENT_SECRET}&access_token=${account.access_token}&service_provider=NAVER`;
      
      await fetch(naverRevokeUrl);
    }

    // 4. DB 데이터 삭제 (트랜잭션 권장)
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