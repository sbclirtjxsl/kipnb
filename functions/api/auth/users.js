import { auth } from "./[[auth]]";

// 계급별 전투력(레벨) 정의
const ROLE_LEVELS = {
    '최고 관리자': 5,
    '관리자': 4,
    '운영진': 3,
    '우수 회원': 2,
    '일반 회원': 1
};

export async function onRequestGet(context) {
    const { env, request } = context;

    try {
        const authInstance = auth(env);
        const session = await authInstance.api.getSession({ headers: request.headers });

        if (!session || !session.user) {
            return new Response(JSON.stringify({ error: "로그인이 필요합니다." }), { status: 401 });
        }

        const myLevel = ROLE_LEVELS[session.user.role] || 1;
        
        if (myLevel < 3) {
            return new Response(JSON.stringify({ error: "관리자 전용 메뉴입니다." }), { status: 403 });
        }

        // 🌟 핵심 보완: 내 등급과 같거나 낮은 등급의 문자열 목록만 배열로 추출
        const visibleRoles = Object.keys(ROLE_LEVELS).filter(role => ROLE_LEVELS[role] <= myLevel);
        const placeholders = visibleRoles.map(() => '?').join(','); // SQL 인젝션 방지용 (?, ?, ?) 생성

        // 1. 사람(본체) 목록 가져오기 (내 등급 이하의 사람만 SELECT 하도록 필터링 추가)
        const { results: users } = await env.DB.prepare(
            `SELECT id, name, email, role, createdAt FROM user WHERE role IN (${placeholders}) ORDER BY createdAt DESC`
        ).bind(...visibleRoles).all();

        // 2. 이 사람들이 연동한 소셜 꼬리표(account) 전부 가져오기
        const { results: accounts } = await env.DB.prepare(
            "SELECT userId, providerId FROM account"
        ).all();

        // 3. 사람 ID를 기준으로 어떤 소셜들을 연동했는지 배열로 묶어주기
        const providersMap = {};
        accounts.forEach(acc => {
            if (!providersMap[acc.userId]) providersMap[acc.userId] = [];
            providersMap[acc.userId].push(acc.providerId);
        });

        const formattedUsers = users.map(u => ({
            ...u,
            providers: providersMap[u.id] || []
        }));

        return new Response(JSON.stringify({ success: true, users: formattedUsers }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        console.error("Users Fetch Error:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}