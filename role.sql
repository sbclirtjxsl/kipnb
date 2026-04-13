-- 기존 유저 테이블에 'role' 이라는 칸을 추가하고, 기본값은 '일반 회원'으로 설정합니다.
ALTER TABLE "user" ADD COLUMN role TEXT DEFAULT '일반 회원';