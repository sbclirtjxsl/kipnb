// functions/api/auth/update-role.js
import { auth } from "./[[auth]]";

const ROLE_LEVELS = {
    '최고 관리자': 5,
    '관리자': 4,
    '운영진': 3,
    '우수 회원': 2,
    '일반 회원': 1
};

export async function onRequestPost(context) {
    const { env, request } = context;

    try {
        const authInstance = auth(env);
        const session = await authInstance.api.getSession({ headers: request.headers });

        // 1. 로그인 확인
        if (!session || !session.user) {
            return new Response(JSON.stringify({ error: "로그인이 필요합니다." }), { status: 401 });
        }

        const { userId, newRole } = await request.json();

        if (!userId || !newRole || !ROLE_LEVELS[newRole]) {
            return new Response(JSON.stringify({ error: "잘못된 요청입니다." }), { status: 400 });
        }

        const myLevel = ROLE_LEVELS[session.user.role] || 1;

        // 2. 권한 1차 체크: 최소 운영진(3) 이상인가?
        if (myLevel < 3) {
            return new Response(JSON.stringify({ error: "권한이 부족합니다." }), { status: 403 });
        }

        // 3. 타겟 유저의 현재 정보 조회 (하극상 방지 검증용)
        const targetUser = await env.DB.prepare(
            "SELECT role FROM user WHERE id = ?"
        ).bind(userId).first();

        if (!targetUser) {
            return new Response(JSON.stringify({ error: "대상 회원을 찾을 수 없습니다." }), { status: 404 });
        }

        const targetCurrentLevel = ROLE_LEVELS[targetUser.role] || 1;
        const newRoleLevel = ROLE_LEVELS[newRole];

        // 4. 보안 2차 체크 (가장 중요 🌟)
        // - 대상의 현재 등급이 나보다 같거나 높으면 건드릴 수 없음
        if (myLevel <= targetCurrentLevel) {
            return new Response(JSON.stringify({ error: "자신과 같거나 높은 등급의 회원은 관리할 수 없습니다." }), { status: 403 });
        }
        // - 내가 부여하려는 등급이 내 등급과 같거나 높으면 안 됨 (운영진이 남을 운영진으로 만들 수 없음)
        if (myLevel <= newRoleLevel) {
            return new Response(JSON.stringify({ error: "자신의 등급과 같거나 높은 등급으로 올릴 수 없습니다." }), { status: 403 });
        }

        // 5. 모든 검문을 통과하면 실제 D1 데이터베이스 업데이트
        const result = await env.DB.prepare(
            "UPDATE user SET role = ? WHERE id = ?"
        ).bind(newRole, userId).run();

        if (result.success) {
            return new Response(JSON.stringify({ success: true, message: "등급 변경 성공" }), { status: 200 });
        } else {
            throw new Error("DB 업데이트 실패");
        }

    } catch (error) {
        console.error("Update Role Error:", error);
        return new Response(JSON.stringify({ error: "서버 오류가 발생했습니다." }), { status: 500 });
    }
}