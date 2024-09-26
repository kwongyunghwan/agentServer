import { selectorFamily } from "recoil";
import { messageListState } from "../atoms/messageList";

export const messageListSortState = selectorFamily({
  key: "messageListSortState",
  get: (id) =>({ get }) => {
    const data = get(messageListState);
    const result = data.filter((v) => v.chat_id === id)
    return result
  }
})