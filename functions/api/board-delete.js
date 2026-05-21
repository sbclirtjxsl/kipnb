export async function onRequestDelete(context) {
    const { env, request } = context;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return new Response(JSON.stringify({ error: "삭제할 글 번호가 없습니다." }), { status: 400 });
    }

    try {
        const numericId = parseInt(id, 10);

        // 1. 🔍 DB에서 지우기 전에 먼저 해당 게시글의 정보를 가져옵니다 (R2 파일 경로 확인용)
        const post = await env.DB.prepare(
            "SELECT image_url, file_url FROM board WHERE id = ?"
        ).bind(numericId).first();

        if (!post) {
            return new Response(JSON.stringify({ error: "DB에 해당 게시물이 존재하지 않습니다." }), { status: 404 });
        }

        // 2. 🗑️ R2 스토리지 파일 삭제 처리 함수
        const deleteR2File = async (url) => {
            if (!url) return;
            try {
                // URL 주소에서 도메인을 제외한 실제 파일명/경로(Key)만 추출합니다.
                const urlObj = new URL(url);
                const fileKey = decodeURIComponent(urlObj.pathname.substring(1));

                // 🌟 핵심 변경: env.R2가 아니라 env.MY_R2 로 매칭!
                if (fileKey && env.MY_R2) {
                    await env.MY_R2.delete(fileKey);
                    console.log(`[R2 DELETE SUCCESS]: ${fileKey}`);
                }
            } catch (r2Error) {
                console.error(`[R2 DELETE FAIL]: ${url}`, r2Error);
            }
        };

        // 게시글에 등록된 이미지와 파일이 있다면 R2에서 각각 삭제 요청
        if (post.image_url) await deleteR2File(post.image_url);
        if (post.file_url) await deleteR2File(post.file_url);


        // 3. 🏛️ R2 파일 처리가 끝난 후, D1 데이터베이스에서 게시글 최종 삭제
        const result = await env.DB.prepare(
            "DELETE FROM board WHERE id = ?"
        ).bind(numericId).run();

        if (result.success && result.meta.changes > 0) {
            return new Response(JSON.stringify({ message: "게시글 및 첨부파일이 완전히 삭제되었습니다." }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        } else {
            return new Response(JSON.stringify({ error: "데이터베이스 삭제에 실패했습니다." }), { status: 500 });
        }

    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}