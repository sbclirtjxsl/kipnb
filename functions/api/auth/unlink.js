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
    
    // 2. 어떤 소셜 공급자(google, naver)를 해제할지 바디 파싱
    const { providerId } = await request.json();
    if (!providerId) {
      return new Response(JSON.stringify({ error: "해제할 소셜 공급자 정보가 없습니다." }), { status: 400 });
    }

    // 3. 네이버 해제 시 영구 차단 방어막
    if (providerId === 'naver') {
      const account = await env.DB.prepare(
        "SELECT accessToken FROM account WHERE userId = ? AND providerId = 'naver' LIMIT 1"
      ).bind(userId).first();

      if (account?.accessToken) {
        const naverRevokeUrl = `https://nid.naver.com/oauth2.0/token?grant_type=delete&client_id=${env.NAVER_CLIENT_ID}&client_secret=${env.NAVER_CLIENT_SECRET}&access_token=${account.accessToken}&service_provider=NAVER`;
        // 백엔드 세션 연결 고리만 안전하게 소멸시키도록 비동기 파싱 처리
        await fetch(naverRevokeUrl).catch(() => {});
      }
    }

    // 4. D1 데이터베이스에서 지정한 소셜 연동 행(account)만 칼같이 삭제
    await env.DB.prepare(
      "DELETE FROM account WHERE userId = ? AND providerId = ?"
    ).bind(userId, providerId).run();

    // 5. 🔥 [수정 완료]: 존재하지 않는 email 컬럼을 빼고, 현재 DB에 연동 유지 중인 providerId만 안전하게 긁어옵니다.
    const { results: activeAccounts } = await env.DB.prepare(
      "SELECT providerId FROM account WHERE userId = ?"
    ).bind(userId).all();

    // 6. 최신 생존 장부를 프론트엔드로 즉시 전송
    return new Response(JSON.stringify({ 
      success: true, 
      message: `${providerId} 연동이 해제되었습니다.`,
      activeAccounts: activeAccounts || [] 
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