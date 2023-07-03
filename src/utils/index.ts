export {onDomReady} from './onDomReady'
export {Storage} from './storage'
export {
  listAdapter,
  loadRootNode,
  loadNode,
  buildTree,
} from './nodeTools'
export type { NodeType } from './nodeTools';

export function getShareId() {
  const url = location.pathname;
  const match =url.match(/(?<=\/s\/)(\w+)(?=\/folder)?/g)  
  if(!match) throw new Error('share_id not found')
  return match[0] as string;
}
export const parseCookie = (str:string) =>
  str
    .split(";")
    .map((v) => v.split("="))
    .reduce((acc, v) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      return acc;
    }, {});



