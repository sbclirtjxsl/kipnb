export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    // 1. 프론트엔드에서 보낸 FormData 읽기
    const formData = await request.formData();
    const name = formData.get('name');
    const profileImage = formData.get('profileImage');
    const userId = formData.get('userId'); // ✅ 프론트엔드에서 보낸 실제 유저 ID 받기

    if (!userId) {
      return new Response(JSON.stringify({ success: false, message: "유저 식별자(ID)가 없습니다." }), { status: 400 });
    }

    let newImageUrl = null;

    // 2. 프로필 이미지가 전송되었다면 R2에 업로드
    if (profileImage && profileImage.name) {
      const fileExtension = profileImage.name.split('.').pop();
      const fileName = `profile_${userId}_${Date.now()}.${fileExtension}`;
      
      // ✅ 수정 1: env.MY_R2_BUCKET -> env.MY_R2 (wrangler.toml과 일치시킴)
      await env.MY_R2.put(fileName, profileImage);
      
      // ✅ 수정 2: R2 버킷의 실제 공개 URL 주소로 변경해야 합니다!
      // 주의: 아래 도메인은 R2 설정에서 할당받은 Public URL이나 커스텀 도메인으로 꼭 바꿔주세요.
      newImageUrl = `https://pub-xxxxxx.r2.dev/${fileName}`; 
    }

    // 3. D1 데이터베이스에 유저 정보 업데이트
    // ✅ 수정 3: 테이블 이름을 users -> user 로 변경 (Better Auth 기본 테이블명)
    if (newImageUrl) {
      // 사진과 이름 모두 변경할 때
      await env.DB.prepare(
        `UPDATE user SET name = ?, image = ? WHERE id = ?`
      ).bind(name, newImageUrl, userId).run();
    } else {
      // 사진은 안 바꾸고 이름만 변경할 때
      await env.DB.prepare(
        `UPDATE user SET name = ? WHERE id = ?`
      ).bind(name, userId).run();
    }

    // 성공 응답 보내기
    return new Response(JSON.stringify({ success: true, message: "업데이트 성공" }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("업데이트 에러:", error);
    return new Response(JSON.stringify({ success: false, message: "서버 오류가 발생했습니다." }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}