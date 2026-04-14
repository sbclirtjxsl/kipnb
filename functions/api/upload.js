export async function onRequestPost(context) {
  const { env, request } = context;

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return new Response(JSON.stringify({ error: "파일이 없습니다." }), { status: 400 });
    }

    // 파일 이름 겹침 방지용 시간표 추가
    const fileName = `${Date.now()}-${file.name}`;

    // R2 창고에 사진 저장!
    await env.MY_R2.put(fileName, file.stream(), {
      httpMetadata: { contentType: file.type || "image/webp" },
    });

    // ⭐ 질문자님의 진짜 R2 창고 주소 적용 완료!
    const publicUrl = `https://pub-ddea0ea47e83478782276137a3f52879.r2.dev/${fileName}`;

    return new Response(JSON.stringify({ url: publicUrl }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}