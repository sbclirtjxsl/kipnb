export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    // 1. 프론트엔드에서 보낸 FormData 읽기
    const formData = await request.formData();
    const name = formData.get('name');
    const profileImage = formData.get('profileImage');
    const userId = formData.get('userId'); // 프론트엔드에서 보낸 실제 유저 ID 받기

    if (!userId) {
      return new Response(JSON.stringify({ success: false, message: "유저 식별자(ID)가 없습니다." }), { status: 400 });
    }

    let newImageUrl = null;

    // 2. 프로필 이미지가 전송되었다면 R2에 업로드
    if (profileImage && profileImage.name) {
      const fileExtension = profileImage.name.split('.').pop();
      const fileName = `profile_${userId}_${Date.now()}.${fileExtension}`;
      
      // env.MY_R2 (wrangler.toml과 일치)
      await env.MY_R2.put(fileName, profileImage);
      
      // 🚨 방금 화면에서 복사하신 진짜 주소를 아래 따옴표 안에 덮어씌워주세요!
      // (주의: 맨 뒤에 슬래시(/)가 있다면 빼고 넣어주시는게 깔끔합니다)
      const r2PublicDomain = "https://여기에-복사한-주소를-붙여넣으세요"; 
      
      newImageUrl = `${r2PublicDomain}/${fileName}`; 
    }

    // 3. D1 데이터베이스에 유저 정보 업데이트
    // 테이블 이름을 user 로 변경 (Better Auth 기본 테이블명)
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