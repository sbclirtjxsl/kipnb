export async function onRequestDelete(context) {
    const { env, request } = context;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return new Response(JSON.stringify({ error: "삭제할 글 번호가 없습니다." }), { status: 400 });
    }

    try {
        const numericId = parseInt(id, 10);

        // 1. DB에서 게시글 정보 가져오기
        const post = await env.DB.prepare(
            "SELECT image_url, file_url FROM board WHERE id = ?"
        ).bind(numericId).first();

        if (!post) {
            return new Response(JSON.stringify({ error: "DB에 해당 게시물이 존재하지 않습니다." }), { status: 404 });
        }

        // 🌟 핵심 보완: 배열 문자열("['http...']")을 실제 자바스크립트 배열로 안전하게 변환하는 함수
        const parseUrls = (urlData) => {
            if (!urlData) return [];
            try {
                return urlData.startsWith('[') ? JSON.parse(urlData) : [urlData];
            } catch (e) {
                return [urlData]; // 파싱 실패 시 단일 문자열 배열로 반환
            }
        };

        const imageUrls = parseUrls(post.image_url);
        const fileUrls = parseUrls(post.file_url);

        // 2. R2 스토리지 파일 단일 삭제 함수
        const deleteR2File = async (url) => {
            if (!url) return;
            try {
                const urlObj = new URL(url);
                const fileKey = decodeURIComponent(urlObj.pathname.substring(1));

                if (fileKey && env.MY_R2) {
                    await env.MY_R2.delete(fileKey);
                    console.log(`[R2 DELETE SUCCESS]: ${fileKey}`);
                }
            } catch (r2Error) {
                console.error(`[R2 DELETE FAIL]: ${url}`, r2Error);
            }
        };

        // 🌟 핵심 보완: 추출된 여러 개의 이미지와 파일 URL을 하나씩 순회하며 R2에서 삭제
        for (const url of imageUrls) {
            await deleteR2File(url);
        }
        for (const url of fileUrls) {
            await deleteR2File(url);
        }

        // 3. R2 파일 삭제 완료 후 D1 데이터베이스에서 게시글 삭제
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