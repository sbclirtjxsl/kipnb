export async function onRequestPost(context) {
    const { env, request } = context;

    try {
        const data = await request.json();
        const { category, title, content, author_name, author_email, has_file, image_url } = data;

        if (!category || !title || !content || !author_name || !author_email) {
            return new Response(JSON.stringify({ error: "필수 항목이 누락되었습니다." }), { status: 400 });
        }

        // DB 장부에 image_url 칸을 포함해서 저장!
        const result = await env.DB.prepare(
            `INSERT INTO board (category, title, content, author_name, author_email, has_file, image_url)
             VALUES (?, ?, ?, ?, ?, ?, ?)`
        ).bind(
            category, 
            title, 
            content, 
            author_name, 
            author_email, 
            has_file || 0,
            image_url || "" 
        ).run();

        if (result.success) {
            return new Response(JSON.stringify({ message: "게시글이 성공적으로 등록되었습니다." }), {
                status: 200, headers: { "Content-Type": "application/json" }
            });
        } else {
            throw new Error("DB 저장에 실패했습니다.");
        }

    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}