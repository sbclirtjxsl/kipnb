export async function onRequestPost(context) {
    const { env, request } = context;

    try {
        const data = await request.json();
        
        // ⭐ 1. 프론트에서 보낸 custom_date, access_level과 함께 'is_secret'도 받습니다!
        const { 
            category, title, content, author_name, author_email, 
            has_file, image_url, file_url, custom_date, access_level, is_secret 
        } = data;

        if (!category || !title || !content || !author_name || !author_email) {
            return new Response(JSON.stringify({ error: "필수 항목이 누락되었습니다." }), { status: 400 });
        }

        // ⭐ 2. 권한 레벨 및 비밀글 값 안전 변환 (값이 없으면 0)
        const safeAccessLevel = access_level ? parseInt(access_level, 10) : 0;
        const safeIsSecret = is_secret ? 1 : 0; // 프론트엔드에서 보낸 true/false를 1/0으로 변환

        // 3. 작성일 결정 (관리자가 날짜를 골랐으면 그 날짜, 안 골랐으면 현재 시간)
        const finalCreatedAt = custom_date ? custom_date : new Date().toISOString();

        // ⭐ 4. DB 장부에 is_secret 컬럼을 추가해서 데이터를 꽂아 넣습니다.
        const result = await env.DB.prepare(
            `INSERT INTO board (category, title, content, author_name, author_email, has_file, image_url, file_url, created_at, access_level, is_secret)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
            category, 
            title, 
            content, 
            author_name, 
            author_email, 
            has_file || 0,
            image_url || "", 
            file_url || "",
            finalCreatedAt, 
            safeAccessLevel, 
            safeIsSecret // ⭐ 비밀글 값 바인딩
        ).run();

        if (result.success) {
            return new Response(JSON.stringify({ message: "성공" }), { status: 200 });
        } else {
            throw new Error("DB 저장 실패");
        }
    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}