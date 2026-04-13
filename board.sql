-- 기존에 board 테이블이 있다면 지우고 새로 만듭니다. (초기화)
DROP TABLE IF EXISTS board;

CREATE TABLE board (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,               -- 카테고리 (예: 'pr', 'notice', 'qna' 등)
    title TEXT NOT NULL,                  -- 글 제목
    content TEXT NOT NULL,                -- 글 내용
    author_name TEXT NOT NULL,            -- 작성자 이름
    author_email TEXT NOT NULL,           -- 작성자 이메일 (권한 확인용)
    
    -- 파일 주소 (파일이 없으면 NULL)
    image_url TEXT,                       -- 썸네일/이미지 주소
    file_url TEXT,                        -- 첨부파일(PDF, ZIP 등) 주소
    
    -- ⭐ 핵심: 첨부파일이 있는지 없는지 깃발(Flag)을 꽂아둡니다. (1: 있음, 0: 없음)
    has_file INTEGER DEFAULT 0,
    
    views INTEGER DEFAULT 0,              -- 조회수
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- 작성일
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP  -- 수정일
);

-- (테스트용) 더미 데이터 1개 넣어보기: 관리자가 '홍보' 게시판에 첨부파일을 올려서 쓴 글
INSERT INTO board (category, title, content, author_name, author_email, file_url, has_file)
VALUES ('pr', '2026년 상반기 홍보 자료입니다.', '첨부파일을 확인해주세요.', '관리자', '본인이메일@gmail.com', 'https://example.com/test.pdf', 1);

-- (테스트용) 더미 데이터 1개 넣어보기: 일반 회원이 '문의상담' 게시판에 파일 없이 쓴 글
INSERT INTO board (category, title, content, author_name, author_email, has_file)
VALUES ('qna', '인증 절차가 궁금합니다.', '어떻게 신청하나요?', '홍길동', 'hong@test.com', 0);