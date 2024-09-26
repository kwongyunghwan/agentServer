import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
// messageListState 변수를 전역변수로 설정하고 세션스토리지 설정하여 새로고침을 해도 값을 안 잃도록 함.

const { persistAtom } = recoilPersist({
    key: "sessionStorage", // 고유한 key 값
    storage: sessionStorage,
})
export const messageListState = atom({
    key: 'messageListState', // 상태의 고유한 키
    default: [], // 기본값은 빈 배열
    effects_UNSTABLE: [persistAtom]
});
