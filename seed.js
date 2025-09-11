// 이 파일은 최초의 관리자 계정을 데이터베이스에 생성하기 위해 딱 한 번만 실행합니다.
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// 1. User 모델 정의 (index.js에서 그대로 가져옴)
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// 2. 관리자 정보 설정
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'naroo1318'; // 실제 운영 시에는 더 복잡한 비밀번호를 사용하세요.

// 3. 데이터베이스 연결 및 관리자 생성 함수
async function createAdminUser() {
    try {
        // 데이터베이스 연결
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('✅ 데이터베이스에 연결되었습니다.');

        // 기존에 admin 계정이 있는지 확인
        const existingAdmin = await User.findOne({ username: ADMIN_USERNAME });
        if (existingAdmin) {
            console.log('ℹ️ 관리자 계정이 이미 존재합니다. 스크립트를 종료합니다.');
            return; // 이미 계정이 있으면 아무것도 하지 않음
        }

        // 비밀번호 암호화 (10은 암호화 강도, 숫자가 높을수록 강력하지만 오래 걸림)
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

        // 새로운 관리자 유저 생성
        const adminUser = new User({
            username: ADMIN_USERNAME,
            password: hashedPassword
        });

        // 데이터베이스에 저장
        await adminUser.save();
        console.log('🎉 관리자 계정이 성공적으로 생성되었습니다!');
        console.log(`   - 사용자 이름: ${ADMIN_USERNAME}`);
        console.log(`   - 비밀번호: ${ADMIN_PASSWORD}`);

    } catch (error) {
        console.error('❌ 관리자 생성 중 오류 발생:', error);
    } finally {
        // 모든 작업이 끝나면 데이터베이스 연결 종료
        await mongoose.disconnect();
        console.log('🔌 데이터베이스 연결이 종료되었습니다.');
    }
}

// 4. 함수 실행
createAdminUser();