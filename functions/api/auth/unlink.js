// functions/api/auth/unlink.js
import { auth } from "./[[auth]]"; 

export async function onRequestPost(context) {
  const { env, request } = context;

  try {
    const authInstance = auth(env);

    // 1. 현재 세션 검증
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
    
    // 2. 프론트엔드 요청 바디 파싱
    const { providerId } = await request.json();
    if (!providerId) {
      return new Response(JSON.stringify({ error: "해제할 소셜 공급자 정보가 없습니다." }), { status: 400 });
    }

    // 3. 네이버인 경우 토큰 취소 통보 (선택 사항)
    if (providerId === 'naver') {
      const account = await env.DB.prepare(
        "SELECT accessToken FROM account WHERE userId = ? AND providerId = 'naver' LIMIT 1"
      ).bind(userId).first();

      if (account?.accessToken) {
        const naverRevokeUrl = `https://nid.naver.com/oauth2.0/token?grant_type=delete&client_id=${env.NAVER_CLIENT_ID}&client_secret=${env.NAVER_CLIENT_SECRET}&access_token=${account.accessToken}&service_provider=NAVER`;
        await fetch(naverRevokeUrl).catch(() => {});
      }
    }

    // 4. 🔥 D1 데이터베이스에서 지정한 소셜 연동 행만 칼같이 삭제
    await env.DB.prepare(
      "DELETE FROM account WHERE userId = ? AND providerId = ?"
    ).bind(userId, providerId).run();

    // 5. 🌟 [핵심 보완] 삭제 후 현재 DB(account 테이블)에 최종 생존해 있는 연동 데이터만 새로 조회!
    const { results: activeAccounts } = await env.DB.prepare(
      "SELECT providerId, email FROM account WHERE userId = ?"
    ).bind(userId).all();

    // 6. 최신 장부를 프론트엔드에 고스란히 반환
    return new Response(JSON.stringify({ 
      success: true, 
      message: `${providerId} 연동이 해제되었습니다.`,
      activeAccounts: activeAccounts || [] // 프론트엔드가 즉시 화면을 그릴 수 있는 실시간 소스 데이터
    }), {
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