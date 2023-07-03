import { Storage } from "../utils/storage";
import { TokenPayload } from "../utils/initConfig";
// 获取文件列表
export async function getList(parent_file_id: string = 'root') {
  const payload = Storage.get<TokenPayload>("payload");
  if(!payload) throw new Error('payload not found')
  const result = await $.ajax({
    url: "https://api.aliyundrive.com/adrive/v3/file/list",
    type: "POST",
    headers: payload.headers,
    data: JSON.stringify({
      share_id: payload.share_id,
      parent_file_id: parent_file_id,
      limit: 100,
      image_thumbnail_process: "image/resize,w_160/format,jpeg",
      image_url_process: "image/resize,w_1920/format,jpeg",
      video_thumbnail_process: "video/snapshot,t_1000,f_jpg,ar_auto,w_300",
      order_by: "name",
      order_direction: "DESC",
    }),
  });
  return result;
}
