// functions/api/auth/accounts.js
import { auth } from "./[[auth]]"; 

export async function onRequestGet(context) {
  const { env, request } = context;

  try {
    const authInstance = auth(env);
    // 현재 접속한 유저의 세션 확인
    const session = await authInstance.api.getSession({ headers: request.headers });

    if (!session) {
      return new Response(JSON.stringify({ error: "로그인이 필요합니다." }), { 
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const userId = session.user.id;

    // 🔥 D1 데이터베이스에서 이 유저가 연동한 모든 소셜 공급자(providerId) 리스트 조회
    const { results } = await env.DB.prepare(
      "SELECT providerId FROM account WHERE userId = ?"
    ).bind(userId).all();

    return new Response(JSON.stringify({ 
      success: true, 
      accounts: results || [] 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Fetch Accounts Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}