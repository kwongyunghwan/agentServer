import { selectorFamily } from "recoil";
import { messageListState } from "../atoms/messageList";
// messageListState에서 해당하는 id 값만 추출 

export const messageListSortState = selectorFamily({
  key: "messageListSortState",
  get: (id) =>({ get }) => {
    const data = get(messageListState);
    const result = data.filter((v) => v.chat_id === id)
    return result
  }
})