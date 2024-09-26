const historySchema = require("../db/schema/chatMessage");
const chatListSchema = require("../db/schema/chatList");
const clientInfo = new Map();
let connectionTimeout = '';
/*
서버 소켓 연결
*/
module.exports = (io) =>{

    io.on("connection", async (socket) => {

      // 채팅방 입장시 이벤트, 소켓 join 함
      socket.on("event:open", async (data) => {
        socket.join(data.chat_id);
        // 연결시간 초과를 위한 타임아웃 설정(60초,60000)
        connectionTimeout = setTimeout(sessionCancel,60000);
        try {
          // 방목록 스키마를 기준으로 데이터를 저장함
          const chatList = new chatListSchema({
            chat_id: data.chat_id,
            cus_code: data.cus_code,
            chat_memo:'',
            status: 1
          });
          // clientInfo 소켓id, chat_id, cus_code를 map형식으로 저장
          clientInfo.set(socket.id, { chat_id : data.chat_id, cus_code : data.cus_code}); 

          // 상담원이 대기중 채팅방에 들어왔을 경우 몽고db CHAT_LIST 컬렉션에 해당 룸상태를 상담중(2)로 변경 및 상담원 아이디 추가
          if(data.cus_code =='상담원'){
            console.log(`상담원이 ${data.chat_id}번 방에 입장했습니다`);
            db.collection('CHAT_LIST').updateOne(
              {chat_id:data.chat_id},
              {$set: { status: 2, cnsr_code: data.cnsr_code }}
            );
          }else{
            // 몽고db CHAT_LIST 컬렉션에 대기중(1)상태에 chat_id, cus_code를 추가함
            await db.collection('CHAT_LIST').insertOne(chatList);
            console.log(`${data.cus_code}유저가 ${data.chat_id}번 방에 입장했습니다`);
          }
        } catch (error) {
          console.error(`세션 저장 중 오류 발생: ${error}`);
        }
      });

      // 채팅방에서 메시지를 송수신 이벤트 처리
      socket.on("event:send_message", async (data) => {
        console.log(data);
        // 메시지를 받았을경우 타임아웃 재연장, 연결시간 초과를 위한 타임아웃 설정(60초,60000)
        clearTimeout(connectionTimeout);
        connectionTimeout = setTimeout(sessionCancel,60000);

        // 해당 chat_id에 받은메시지로 메시지들을 다 보냄
        socket.to(data.chat_id).emit("event:receive_message", data);

        try {
          // 히스토리 스키마를 기준으로 데이터를 저장함
          const history = new historySchema({
              chat_id: data.chat_id,
              send_user: data.cus_code,
              cnsr_code: data.cnsr_code || '',
              chat_message: data.msg.contents.text,
              created_at : data.msg.at
          });
          // MongoDB CHAT_MESSAGE 컬렉션에 히스토리 스키마로 정제한 데이터 저장
          await db.collection('CHAT_MESSAGE').insertOne(history);

          console.log(`메시지가 성공적으로 저장되었습니다.`);
        } catch (error) {
          console.error(`메시지 저장 중 오류 발생: ${error}`);
        }
      });

      // 방 나가는 이벤트
      socket.on("event:leave_room", (data) =>{
        
        try {
          clearTimeout(connectionTimeout);
          socket.to(data.chat_id).emit("event:receive_message", {chat_id: data.chat_id, status: 9});
          console.log(`${data.chat_id} 세션이 종료되었습니다. leave_room`);
          socket.leave(data.chat_id);
          // 상담종료(9)로 세팅하여 몽고db CHAT_LIST 컬렉션에 업데이트
          db.collection('CHAT_LIST').updateOne(
          {chat_id:data.chat_id},
          {$set: { status: 9 }}
        );
        clientInfo.delete(socket.id);
      }catch(error) {
        console.log(`leave room, 세션 변경 중 오류가 발생했습니다.${error}`);
      }
      })

      // 메모 기능
      socket.on('event:save_memo', async(memoData) => {
        console.log(memoData);
        try {
          await saveMemo(memoData);
          console.log(`메모가 성공적으로 저장되었습니다.`);        
        } catch (error) {
          console.error(`메모 저장 중 오류 발생: ${error}`);
          // 클라이언트에게 실패 응답 전송
        }
      });

      // MongoDB에 메모 저장
      async function saveMemo(data) {
        const { chat_id, cnsr_code, cus_code, chat_memo } = data;
        // 기존 메모가 있는지 확인
          await db.collection('CHAT_LIST').updateOne(
            { chat_id},
            { $set: { chat_memo:chat_memo } }
          );
          console.log("메모 업데이트 성공");
        }
      

      // 접속이 끊어졌을때 콘솔로그 남김
      socket.on("disconnect", () => {
        // 끊어진 socket.id를 해당 변수에서 가져와서 세팅함
        const client = clientInfo.get(socket.id);
        if(client){
          const {chat_id} = client;  
          console.log(`${chat_id} 세션이 성공적으로 끊어졌습니다.`);
          if(chat_id){
          try {
              // 상담종료(9)로 세팅하여 몽고db CHAT_LIST 컬렉션에 업데이트
              db.collection('CHAT_LIST').updateOne(
              {chat_id:chat_id},
              {$set: { status: 9 }}
            );
            clientInfo.delete(socket.id);
          }catch(error) {
            console.log(`disconnet 세션 변경 중 오류가 발생했습니다.${error}`);
          }
        }
      }
    });


      // 세션없애는 함수
      function sessionCancel(){
        console.log(clientInfo)
        const client = clientInfo.get(socket.id);
        if(client){
          const {chat_id} = client;
          io.to(chat_id).emit("event:receive_message", {chat_id: chat_id, status: 9});
          console.log('chatId>>>',chat_id);
          socket.disconnect(true);
        }
      }
  });

}