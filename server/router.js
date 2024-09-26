const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const CounselorModel = require("./db/schema/CHAT_USER");
// 추가
const multer = require("multer");
const path = require("path");

// 로그인 
router.post("/login", async(req, res) => {
    
    try {
        const result = await db.collection('CHAT_USER').findOne({
            cnsr_email : req.query.id,
            cnsr_password : req.query.pw
        });
        if(result){
            const AccessTime = new Date();
            await db.collection('CHAT_USER').updateOne(
                { cnsr_code: result.cnsr_code },
                { $set: { 
                    login_at: AccessTime,
                    cnsr_loginYn: '온라인'
                } }
            );

            res.send({
                'result': result,
                'resultCode': 'SUCCESS',
            })
            console.log("해당 상담원 정보를 찾았습니다.");
        }else{
            res.send({
                'result': '',
                'resultCode': 'Failed' 
            })
            console.log("해당 상담원 정보가 없습니다.");
        }
    }catch(error){
        console.error(`상담원 정보 불러오는 중 오류 발생: ${error}`);
    }
});

// 회원가입 라우터
router.post("/signup", async (req, res) => {
    console.log(req.query);
    try {
        const email = req.query.email;
        const password = req.query.password;
        const name = req.query.name;
        const phoneNumber = req.query.phoneNumber;

        const existingUser = await db.collection('CHAT_USER').findOne({ cnsr_email: email });
        if(existingUser){
            return res.status(400).json({ resultCode: "emailExist", message: "이미 존재하는 이메일입니다." });
        }

        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let cnsr_code = '';
        let codeExist;
        do {
            cnsr_code = '';
            for (let i = 0; i < 4; i++) {
                cnsr_code += letters[Math.floor(Math.random() * letters.length)];
            }
            codeExist = await db.collection('CHAT_USER').findOne({ cnsr_code: cnsr_code });
        } while (codeExist); 
        

        const newUser = new CounselorModel({
            cnsr_code: cnsr_code,
            cnsr_email: email,
            cnsr_password: password,  
            cnsr_name: name,
            cnsr_phnum: phoneNumber,  
            cnsr_role: "reader",  
            cnsr_loginYn: "오프라인",  
            created_at: new Date(),
            login_at: null  // 처음 가입 시 로그인 기록 없음
        });

        const result = await db.collection('CHAT_USER').insertOne(newUser);  // DB에 저장

        console.log("회원가입 성공: ", newUser);
        res.status(201).json({ resultCode: "SUCCESS", message: "회원가입 성공!" });
    } catch (error) {
        console.error(`회원가입 중 오류 발생: ${error}`);
        console.error('에러 상세: ', error.message);  
        res.status(500).json({ resultCode: "ERROR", message: "서버 오류 발생. 다시 시도해주세요." });
    }
});

// 세션체크
router.get("/session", async(req, res) => {
    
    try {
        // 룸상태가 대기중(1)이거나 상담중(2)인 채팅방만 찾기
        const result = await db.collection('CHAT_LIST').find({$or :[{status:1},{status:2}]}).toArray();
        if(result){
            res.send({
                'result': result,
                'resultCode': 'SUCCESS'
            })
        }else{
            res.send({
                'result': '',
                'resultCode': 'Failed' 
            })
            console.log("현재 상담중인 채팅방이 없습니다.");
        }
    }catch(error){
        console.error(`채팅방 정보를 불러오는 중 오류 발생: ${error}`);
    }
});

// 상담원 별 세션 체크
router.get("/session/:cnsrCode", async(req, res) => {
    try {
        const cnsrCode = req.params.cnsrCode;
        console.log(`로그인한 상담원 : ${cnsrCode}`);

        const result = await db.collection('CHAT_LIST').find({ cnsr_code: cnsrCode, status: 2 }).toArray();
        if(result){
            res.send({
                'result': result,
                'resultCode': 'SUCCESS'
            })
            console.log("현재 상담중인 채팅방을 불러왔습니다.");
        }else{
            res.send({
                'result': '',
                'resultCode': 'Failed' 
            })
            console.log("현재 상담중인 채팅방이 없습니다.");
        }
    }catch(error){
        console.error(`상담중인 채팅방을 불러오는 중 오류 발생: ${error}`);
    }
});

//헬스체크
router.get("/", async(req, res) => {

    try {
        // 서버 연결 정상적으로 작동되는지 확인
        const result = {
            uptime: process.uptime(),
            timestamp:Date.now()
        };
        if(result){
            res.send({
                'result': result,
                'resultCode': 'SUCCESS'
            })
            console.log("현재 서버가 정상 작동중입니다.");
        }else{
            res.send({
                'result': '',
                'resultCode': 'Failed' 
            })
            console.log("현재 서버가 작동중이지 않습니다.");
        }
    }catch(error){
        console.error(`서버 작동중 오류 발생: ${error}`);
    }
});


// 상담원 정보 조회
router.get("/cnsr/:cnsrCode", async (req, res) => {
    try {
        const cnsrCode = req.params.cnsrCode;
        console.log(`로그인한 상담원 : ${cnsrCode}`);

        const counselor = await db.collection('CHAT_USER').findOne({ cnsr_email: cnsrCode });
        console.log(`DB에서 찾은 상담원 : ${counselor ? counselor.cnsr_email : '일치하는 상담원 없음'}`);

        if (!counselor) {
            return res.status(404).json({ message: "상담원 정보를 찾을 수 없어요!" });
        }

        // 상담이력조회 추가
        // cnsr_code와 일치하는 메시지를 찾음
        const initialMessages = await db.collection('CHAT_MESSAGE').find({ cnsr_code: cnsrCode }).toArray();
        const chatIds = initialMessages.map(message => message.chat_id);
        // 동일한 chat_id를 가진 모든 메시지를 찾음
        const allMessages = await db.collection('CHAT_MESSAGE').find({ chat_id: { $in: chatIds } }).toArray();

        res.json({
            counselor,
            chatMessages: allMessages
        });

    } catch (error) {
        console.error(`상담원 정보 가져오는 중 에러 발생 : ${error}`);
        res.status(500).json({ message: "서버 에러" });
    }
});

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// 전화번호 변경
router.patch("/change", async (req, res) => {
    const { cnsrCode, newPhoneNum } = req.body;

    try {
        const counselor = await db.collection('CHAT_USER').findOneAndUpdate(
            { cnsr_email: cnsrCode },
            { $set: { cnsr_phnum: newPhoneNum} },
            { new: true} // 업데이트된 사항 반환       
        );

        if (!counselor) {
            return res.status(404).json({ message: "상담원 정보를 찾을 수 없어요!" });
        }

        console.log("전화번호가 성공적으로 변경되었습니다."); // ${JSON.stringify(counselor)}로 확인 가능
        res.status(200).json({ success: true, message: "전화번호가 성공적으로 변경되었습니다." });


    } catch (error) {
        console.error(`전화번호 변경 중 에러 발생: ${error}`);
        res.status(500).json({ message: "서버 에러" });
    }
});

// 상담이력 조회
router.get("/cnsr/list/:cnsrCode", async (req, res) => {
    const cnsrEmail = req.params.cnsrCode;
    try {
        // 이메일 주소 비교
        const cnsr = await db.collection('CHAT_USER').findOne( {cnsr_email: cnsrEmail}, { projection: {cnsr_code: 1} });
        if (!cnsr) {
            return res.status(404).send("상담원을 찾을 수 없어요!");
        }

        // 이메일 주소와 CHAT_LIST의 cnsr_code 조인
        const chatHistory = await db.collection('CHAT_LIST').aggregate([
            {
                $match: { cnsr_code: cnsrEmail }
            },
            {
                $project: {
                    chat_id: 1,
                    cus_code: 1,
                    status: 1,
                    created_at: 1
                }
            },
            {
                $sort: { created_at: -1} // 최신순 정렬
            }

        ]).toArray();

        res.json(chatHistory);
        // console.log(chatHistory);
    } catch (error) {
        res.status(500).send(`상담 이력 불러오는 중 에러 발생: ${error}`);
    }
});

// 정적 파일
router.use("/db/profile", express.static(path.join(__dirname, "db/profile")));

// multer 설정 (이미지 업로드)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./db/profile/");
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post("/img/upload", upload.single("file"), async (req, res) => {
    const cnsrCode = req.body.cnsrCode;
    const filePath = req.file.path;
    const imageUrl = `http://localhost:4000/${filePath.replace(/\\/g, '/')}`;

    try {
        const result = await db.collection("CHAT_USER").updateOne(
            { cnsr_email: cnsrCode },
            { $set: { cnsr_img: imageUrl } },
        );
        
        console.log(`cnsrCode: ${cnsrCode}, cnsr: ${JSON.stringify(result)}`);

        if (!result.matchedCount === 0) {
            return res.status(404).json({ message: "상담원 정보 못찾음!" });
        }
        
        res.json({ imageUrl });
    } catch (err) {
        console.error(`사진 변경 에러 : ${err}`);
        res.status(500).send({ message: "프로필 사진 변경 에러" });
    }
});

// 상담원 조회
router.get("/chatUser", async(req, res) => {
    try {
        const result = await db.collection('CHAT_USER').find().toArray();
        if(result){
            res.send({
                'result': result,
                'resultCode': 'SUCCESS'
            })
            console.log("상담원 목록을 불러왔습니다.");
        }else{
            res.send({
                'result': '',
                'resultCode': 'Failed' 
            })
            console.log("상담원 목록이 없습니다.");
        }
    }catch(error){
        console.error(`상담원 목록을 불러오는 중 오류 발생: ${error}`);
    }
});

// 0508 상담원 리스트 조회 -ge
router.get("/counselerList", async(req, res) => {
    
    try {
        const result = await db.collection('CHAT_USER').find().toArray();
        console.log(`counseler List ${result}`)
        if(result){
            res.send({
                'result': result,
                'resultCode': 'SUCCESS'
            })
        }else{
            res.send({
                'result': '',
                'resultCode': 'Failed' 
            })
            console.log("상담원 정보를 불러오는 중 오류 발생");
        }
    }catch(error){
        console.error(`상담원 정보를 불러오는 중 오류 발생: ${error}`);
    }
});
//상담이력조회
router.get("/history", async(req, res) => {
    try {
        const result = await db.collection('CHAT_MESSAGE').find().toArray();
        console.log(result);
        if(result){
            console.log("상담 이력을 조회하였습니다당당.");
            // 상담 이력 데이터를 클라이언트에게 응답으로 보내기
            res.send({
                'result': result,
                'resultCode': 'SUCCESS'
            });
        } else {
            res.send({
                'result': [],
                'resultCode': 'FAILED' 
            });
            console.log("상담 이력이 없습니다.");
        }
    } catch(error) {
        console.error(`채팅 이력을 불러오는 중 오류 발생: ${error}`);
        res.status(500).send({
            'result': [],
            'resultCode': 'ERROR',
            'message': '상담 이력 조회 중 오류가 발생하였습니다.'
        });
    }
});


// 상담이력조회상세
router.get("/history/:chat_id", async (req, res) => {
    console.log(req.params);
    try {
      const chat_id = req.params.chat_id; // URL 파라미터에서 방 번호 추출
      // 방 정보, 메시지 조회
      const roomInfoList = await db.collection('CHAT_MESSAGE').find({ chat_id: chat_id }).toArray();
      if (roomInfoList.length === 0) {
        return res.status(404).json({ message: 'Room not found' });
      }

      // 메모 조회
      const chatMemoList = await db.collection('CHAT_LIST').find({ chat_id: chat_id }).toArray();
      const chatMemo = chatMemoList.length > 0 ?  chatMemoList[0].chat_memo : null;
      roomInfoList[0].chat_memo = chatMemo;

      // 조회한 방 번호에 대한 모든 정보를 클라이언트에게 응답으로 보냄
      res.json(roomInfoList);
    } catch (error) {
      console.error('Error fetching room info:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
});

// 상담원 권한 변경
router.patch("/updateRole", async (req, res) => {
    const { cnsrCode, role } = req.body;
    console.log(`data check >>> cnsrCode ${cnsrCode}`)
    console.log(`data check >>> role ${role}`)
    try {
        const counselor = await db.collection('CHAT_USER').findOneAndUpdate(
            { cnsr_email: cnsrCode },
            { $set: { cnsr_role: role} },
            { new: true} // 업데이트된 사항 반환       
        );

        if (!counselor) {
            return res.status(404).json({ message: "상담원 정보를 찾을 수 없어요!" });
        }

        console.log("상담원 권한이 변경되었습니다.");
        res.status(200).json({ success: true, message: "상담원 권한이 변경되었습니다." });


    } catch (error) {
        console.error(`권한 변경 실패 : ${error}`);
        res.status(500).json({ message: "서버 에러" });
    }
});

module.exports = router;
