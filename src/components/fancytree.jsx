import React, { createRef } from 'jsx-dom';
import { getShareId ,Storage} from '../utils';


export const FancyTree = () => {
  const handleBtnClick = function(){
   const activeNode = Storage.get('activeNode') 
    console.log("🚀 ~ file: fancytree.jsx:8 ~ handleBtnClick ~ activeNode:", activeNode)
    if (activeNode && activeNode.folder) {
      location.href = `/s/${getShareId()}/folder/${activeNode.key}`;
    }
  }
  return (
    <div className={'tree-container'}>
      <div className={"bar"}>
        <button className={"sunzehuiBtn"} onClick={handleBtnClick}>进入选中文件夹</button>
      </div>
      <div className={'tree'} ></div>
    </div>
  )
}
