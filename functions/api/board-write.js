export async function onRequestPost(context) {
    const { env, request } = context;

    try {
        // 1. 프론트엔드(Write.jsx)에서 보낸 택배(데이터)를 뜯어봅니다.
        const data = await request.json();
        const { category, title, content, author_name, author_email, has_file } = data;

        // 2. 빈칸으로 보낸 건 없는지 검사합니다. (안전장치)
        if (!category || !title || !content || !author_name || !author_email) {
            return new Response(JSON.stringify({ error: "필수 항목이 누락되었습니다." }), { 
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        // 3. 지하 DB(D1) 서랍장에 데이터를 밀어 넣습니다. (INSERT)
        const result = await env.DB.prepare(
            `INSERT INTO board (category, title, content, author_name, author_email, has_file)
             VALUES (?, ?, ?, ?, ?, ?)`
        ).bind(
            category, 
            title, 
            content, 
            author_name, 
            author_email, 
            has_file || 0 // 첨부파일이 없으면 기본값 0
        ).run();

        // 4. 저장이 잘 끝났으면 프론트엔드에 "성공!" 도장을 찍어 보냅니다.
        if (result.success) {
            return new Response(JSON.stringify({ message: "게시글이 성공적으로 등록되었습니다." }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        } else {
            throw new Error("DB 저장에 실패했습니다.");
        }

    } catch (e) {
        // 에러가 나면 무슨 에러인지 알려줍니다.
        return new Response(JSON.stringify({ error: e.message }), { 
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}