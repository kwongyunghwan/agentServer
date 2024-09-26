import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist({
    key: "sessionStorage", // 고유한 key 값
    storage: sessionStorage,
})
export const messageListState = atom({
    key: 'messageListState', // 상태의 고유한 키
    default: [], // 기본값은 빈 배열
    effects_UNSTABLE: [persistAtom]
});
