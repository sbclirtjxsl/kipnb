export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    // 1. 프론트엔드에서 보낸 FormData 읽기
    const formData = await request.formData();
    const name = formData.get('name');
    const profileImage = formData.get('profileImage');
    
    // 💡 현재 로그인한 유저 정보 가져오기 (프로젝트의 인증 방식에 따라 다름)
    // 예: const session = await getSession(request);
    // 예: const userId = session.user.id;
    const userId = "temp_user_id"; // 임시 처리 (실제로는 세션에서 유저 ID를 빼와야 합니다)

    let newImageUrl = null;

    // 2. 프로필 이미지가 전송되었다면 R2에 업로드
    if (profileImage && profileImage.name) {
      // 파일명 중복 방지를 위해 유저ID와 현재 시간을 조합하여 파일명 생성
      const fileExtension = profileImage.name.split('.').pop();
      const fileName = `profile_${userId}_${Date.now()}.${fileExtension}`;
      
      // env.MY_R2_BUCKET 은 wrangler.toml에 설정한 R2 바인딩 이름입니다.
      await env.MY_R2_BUCKET.put(fileName, profileImage);
      
      // R2 버킷에 연결된 커스텀 도메인(공개 URL) 경로를 조합
      newImageUrl = `https://사진저장소-도메인.com/${fileName}`; 
    }

    // 3. D1 데이터베이스에 유저 정보 업데이트
    // env.DB 는 wrangler.toml에 설정한 D1 바인딩 이름입니다.
    if (newImageUrl) {
      // 사진과 이름 모두 변경할 때
      await env.DB.prepare(
        `UPDATE users SET name = ?, image = ? WHERE id = ?`
      ).bind(name, newImageUrl, userId).run();
    } else {
      // 사진은 안 바꾸고 이름만 변경할 때
      await env.DB.prepare(
        `UPDATE users SET name = ? WHERE id = ?`
      ).bind(name, userId).run();
    }

    // 모든 작업이 끝났으면 프론트엔드에 성공 응답 보내기
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