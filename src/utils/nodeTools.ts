import { getList } from "../api/get-file-list";

export interface NodeType {
  name?:string,
    title: string,
    folder: boolean,
    key: string,
    expanded: boolean,
    lazy: boolean,
    children: NodeType[],
}
export function listAdapter(list:NodeType[], isFirst = true) {
  return list.map((item) => {
    const hasFolder = !!item.children;
    const obj = {
      title: item.name,
      folder: hasFolder,
      expanded: isFirst,
      children: [] as NodeType[],
    };
    if (hasFolder) {
      obj.children = listAdapter(item.children, false);
    }
    return obj as NodeType;
  });
}



export const loadRootNode = async () => {
  const list = await getList();
  const children = await Promise.all(
    list.items.map(async (pItem:any) => {
      const cList = await getList(  pItem.file_id );
      return cList.items.map((cItem:any) => {
        return {
          title: cItem.name,
          folder: cItem.type === "folder",
          key: cItem.file_id,
          lazy: true,
        };
      });
    })
  );
  return list.items.map((item: any) => ({
    title: item.name,
    folder: item.type === "folder",
    key: item.file_id,
    expanded: true,
    lazy: true,
    children: children.flat(1),
  })) as NodeType[];
};
export const loadNode = function (_:unknown, data:any) {
  data.result = getList(data.node.key).then((list) => {
    return list.items.map((item:any) => ({
      title: item.name,
      folder: item.type === "folder",
      key: item.file_id,
      lazy: item.type === "folder",
    })) as NodeType[];
  });
};

export async function buildTree(parent_file_id?:string) {
  const treeNode = {
    children: [] as NodeType[],
  };
  const root = await getList(parent_file_id);
  for (let i = 0; i < root.items.length; i++) {
    let node = null;
    if (root.items[i].type === "folder") {
      node = await buildTree(root.items[i].file_id);
      node.name = root.items[i].name;
    } else {
      node = root.items[i];
    }
    treeNode.children.push({...node});
  }
  return treeNode as NodeType;
}
