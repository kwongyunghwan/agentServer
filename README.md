# 실시간 상담 시스템 (Agent Server)

Socket.IO와 MongoDB를 활용한 실시간 1:1 상담 웹 애플리케이션

![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![Socket.IO](https://img.shields.io/badge/Socket.IO-black?style=flat-square&logo=socket.io)
![MongoDB](https://img.shields.io/badge/MongoDB-4.1-green?style=flat-square&logo=mongodb)
![Express](https://img.shields.io/badge/Express-4.19.2-lightgrey?style=flat-square&logo=express)

## 로그인 페이지
<img width="875" height="571" alt="image" src="https://github.com/user-attachments/assets/e2c8c23e-324e-49f9-8989-410665c19566" />

## 메인페이지
<img width="1523" height="763" alt="image" src="https://github.com/user-attachments/assets/24a08cf5-7eae-43da-8b88-aa9058870079" />

## 이력페이지
<img width="1510" height="696" alt="image" src="https://github.com/user-attachments/assets/dad54a82-2a86-440f-93a9-618db6f35c8d" />


## 마이페이지
 <img width="1513" height="807" alt="image" src="https://github.com/user-attachments/assets/bc9368e9-cca3-44ac-98ba-41ced166c271" />

## 관리자기능 페이지
<img width="1525" height="848" alt="image" src="https://github.com/user-attachments/assets/c25b6aa5-5e58-417f-ad96-a6c0a82c6fc9" />

## 프로젝트 소개

실시간으로 고객 상담 요청을 처리하고 상담원의 효율적인 관리를 지원하는 통합 상담 서버 시스템을 구축하는 것을 목표로 합니다. 이 시스템을 통해 상담원은 유입되는 고객의 상담 요청을 즉시 확인하고 수락하여 원활하게 상담을 진행할 수 있으며, 관리자는 전용 관리 기능을 통해 실시간으로 상담원들의 활동 상태 및 전체 상담 현황을 직관적으로 모니터링하고 효과적으로 관리할 수 있는 프로젝트입니다.

### 주요 기능

#### 상담원(Client)
- 대기 중인 채팅방 목록 확인
- 여러 채팅방 동시 관리
- 상담 메모 작성 기능
- 상담 이력 조회
- 프로필 관리 (사진/전화번호)

#### 관리자 (Admin)
- 상담원 목록 관리
- 상담원 권한 변경 (admin/agent/reader)
- 전체 상담 이력 조회

---

## 기술 스택

### Frontend
- **React 18.2.0** - UI 라이브러리
- **Socket.IO Client 4.5.1** - 실시간 양방향 통신
- **Recoil** - 상태 관리
- **Styled Components 5.3.11** - CSS-in-JS
- **Axios 1.6.8** - HTTP 클라이언트
- **React Router v6** - 페이지 라우팅

### Backend
- **Node.js** - 런타임 환경
- **Express 4.19.2** - 웹 프레임워크
- **Socket.IO 4.5.1** - WebSocket 서버
- **MongoDB 4.1** - NoSQL 데이터베이스
- **Mongoose 8.2.4** - ODM
- **Multer** - 파일 업로드

### DevOps
- **Docker** - 컨테이너화
- **Docker Compose** - 멀티 컨테이너 관리

---

## 시작하기

### 1. 환경 요구사항

- **Node.js** 21 이상
- **MongoDB** 4.1 이상
- **Docker** & **Docker Compose**

### 2. 설치 및 실행

#### 방법 1: Docker Compose

```bash
# 저장소 클론
git clone https://github.com/kwongyunghwan/agentserver.git
cd agentserver

# Docker Compose로 실행
docker-compose up -d

# 접속
# 상담원: http://localhost:3000
# 고객: http://localhost:3001
# 서버: http://localhost:4000
```

---

## 사용 방법

### 고객 (User)

1. **채팅 시작**
   - http://localhost:3001 접속
   - 이름 입력 후 "접속" 클릭
   - 고유 채팅방 자동 생성

2. **상담 진행**
   - 메시지 입력 및 전송
   - 상담원 응답 대기
   - 60초 무응답 시 자동 종료

---

### 상담원 (Client)

#### 1️. 회원가입 및 로그인

```
회원가입 → 이메일, 이름, 전화번호, 비밀번호 입력
로그인 → 이메일, 비밀번호 입력
```

#### 2️. 대기 중인 채팅방 확인

- **대기(1)**: 고객이 대기 중인 채팅방
- **상담중(2)**: 현재 상담 진행 중인 채팅방

#### 3️. 상담 진행

1. 대기 목록에서 채팅방 클릭
2. 실시간 메시지 송수신
3. 상담 메모 작성 (우측 메모 영역)
4. 종료: X 버튼 클릭

#### 4️. 마이페이지

- 프로필 사진 변경
- 전화번호 수정
- 나의 상담 이력 조회

#### 5️. 이력 조회

- 전체 상담 이력 검색
- 방 번호 클릭 → 상세 내용 확인
- 메모 내용 확인

---

### 관리자 (Admin)

#### 관리자 기능 접근

- 우측 상단 **"관리자 기능"** 버튼 클릭

#### 1️. 상담원 목록 관리

- 전체 상담원 조회
- 접속 상태 확인 (온라인/오프라인)
- 총 세션 수 확인
- 최초 접속 시간 확인

#### 2️. 권한 변경

```
권한 종류:
- admin: 관리자 (전체 권한)
- agent: 상담원 (상담 권한)
- reader: 조회만 가능
```

1. 상담원 목록에서 **"권한 관리"** 클릭
2. 라디오 버튼으로 권한 선택
3. **"변경"** 클릭

---

## API 엔드포인트

### 인증

#### POST `/login`

로그인

**Query Parameters:**
```javascript
{
  id: "email@example.com",
  pw: "password"
}
```

**Response:**
```javascript
{
  result: {
    cnsr_code: "ABCD",
    cnsr_name: "홍길동",
    cnsr_role: "admin"
  },
  resultCode: "SUCCESS"
}
```

#### POST `/signup`

회원가입

**Query Parameters:**
```javascript
{
  email: "email@example.com",
  password: "password",
  name: "홍길동",
  phoneNumber: "010-1234-5678"
}
```

---

### 세션 관리

#### GET `/session`

전체 대기/상담 중인 채팅방 조회

**Response:**
```javascript
{
  result: [
    {
      chat_id: "uuid",
      cnsr_code: "ABCD",
      cus_code: "홍길동",
      status: 1, // 1:대기, 2:상담중, 9:종료
      created_at: "2024-12-30T..."
    }
  ],
  resultCode: "SUCCESS"
}
```

#### GET `/session/:cnsrCode`

특정 상담원의 상담 중인 채팅방 조회

---

### 상담원 관리

#### GET `/cnsr/:cnsrCode`

상담원 정보 및 상담 이력 조회

**Response:**
```javascript
{
  counselor: {
    cnsr_code: "ABCD",
    cnsr_name: "홍길동",
    cnsr_email: "email@example.com",
    cnsr_phnum: "010-1234-5678",
    cnsr_img: "http://..."
  },
  chatMessages: [...]
}
```

#### PATCH `/change`

전화번호 변경

**Body:**
```javascript
{
  cnsrCode: "email@example.com",
  newPhoneNum: "010-9876-5432"
}
```

#### GET `/chatUser`

전체 상담원 목록 조회

#### PATCH `/updateRole`

상담원 권한 변경

**Body:**
```javascript
{
  cnsrCode: "email@example.com",
  role: "admin" // admin, agent, reader
}
```

---

### 상담 이력

#### GET `/history`

전체 상담 이력 조회

#### GET `/history/:chat_id`

특정 채팅방 상세 이력 조회

---

### 파일 업로드

#### POST `/img/upload`

프로필 사진 업로드

**FormData:**
```javascript
{
  file: File,
  cnsrCode: "email@example.com"
}
```

---

## Socket.IO 이벤트

### Client → Server

#### `event:open`

채팅방 입장

```javascript
socket.emit("event:open", {
  chat_id: "uuid",
  cus_code: "홍길동",
  cnsr_code: "ABCD" // 상담원인 경우
});
```

#### `event:send_message`

메시지 전송

```javascript
socket.emit("event:send_message", {
  chat_id: "uuid",
  cus_code: "홍길동",
  cnsr_code: "ABCD",
  msg: {
    at: new Date(),
    time: "14:30",
    contents: {
      type: "text",
      text: "안녕하세요"
    }
  },
  status: 1
});
```

#### `event:leave_room`

채팅방 나가기

```javascript
socket.emit("event:leave_room", {
  chat_id: "uuid",
  status: 9
});
```

#### `event:save_memo`

메모 저장

```javascript
socket.emit("event:save_memo", {
  chat_id: "uuid",
  cnsr_code: "ABCD",
  cus_code: "홍길동",
  chat_memo: "고객 요청사항..."
});
```

---

### Server → Client

#### `event:receive_message`

메시지 수신

```javascript
socket.on("event:receive_message", (data) => {
  console.log(data.msg.contents.text);
});
```

---

## 데이터베이스 스키마

### Collection: `CHAT_USER`

상담원 정보

```javascript
{
  cnsr_code: String,        // 상담원 코드 (4자리)
  cnsr_name: String,        // 이름
  cnsr_email: String,       // 이메일 (로그인 ID)
  cnsr_password: String,    // 비밀번호
  cnsr_phnum: String,       // 전화번호
  cnsr_img: String,         // 프로필 사진 URL
  cnsr_role: String,        // 권한 (admin/agent/reader)
  cnsr_loginYn: String,     // 접속 상태 (온라인/오프라인)
  created_at: Date,         // 가입일
  login_at: Date            // 최종 로그인 시간
}
```

**Indexes:**
- `cnsr_code: 1`
- `cnsr_email: 1`

---

### Collection: `CHAT_LIST`

채팅방 정보

```javascript
{
  chat_id: String,          // 채팅방 고유 ID (UUID)
  cnsr_code: String,        // 담당 상담원 코드
  cus_code: String,         // 고객 이름
  status: Number,           // 상태 (1:대기, 2:상담중, 9:종료)
  chat_memo: String,        // 상담 메모
  created_at: Date          // 생성 시간
}
```

**Indexes:**
- `{ cus_code: 1, chat_id: 1 }`

---

### Collection: `CHAT_MESSAGE`

메시지 정보

```javascript
{
  chat_id: String,          // 채팅방 ID
  send_user: String,        // 발신자 이름
  cnsr_code: String,        // 상담원 코드 (상담원 메시지인 경우)
  chat_message: String,     // 메시지 내용
  sent_at: Date             // 전송 시간
}
```

**Indexes:**
- `{ userId: 1, roomId: 1 }`

---
