import { Storage } from "./storage";
import { parseCookie, getShareId } from "./index";

interface ShareToken {
  share_token:string
}
export interface TokenPayload {
  headers: any;
  // share_token: string;
  share_id: null|string
}



export function initConfig(){
  let payload :TokenPayload= {
    headers:null,
    share_id: null
  }
  const device_id = parseCookie(document.cookie)["cna"];
  const share_id = getShareId();
  const token = Storage.get<ShareToken>("shareToken");
  if(!token) throw new Error('token not found')

  const headers = {
    'accept': "application/json, text/plain, */*",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
    "content-type": "application/json;charset=UTF-8",
    "x-canary": "client=web,app=adrive,version=v2.3.1",
    "x-device-id": device_id,
    "x-share-token": token.share_token,
  };
  payload = {
    headers,
    share_id,
  }

  Storage.set<TokenPayload>('payload', payload)
}
