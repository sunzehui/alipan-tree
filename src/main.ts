import './style.css';
import { Tag } from './components/tag'
import {FancyTree} from './components/fancytree'
import $ from 'jquery'
import 'jquery.fancytree/dist/skin-lion/ui.fancytree.css'
import 'jquery.fancytree'
import 'jquery.fancytree/dist/modules/jquery.fancytree.edit';
import 'jquery.fancytree/dist/modules/jquery.fancytree.filter';
import { 
  onDomReady, 
  listAdapter, 
  NodeType, 
  loadRootNode, 
  loadNode, 
  buildTree,
  Storage
} from './utils';
import { initConfig } from './utils/initConfig';

interface FancytreeCfg {
  selectMode: number,
  activate: (_:any,data:any) => void,
  source: Promise<NodeType[]> | NodeType[],
  lazyLoad?: (event:unknown, data:any) => void,
}

async function buildFancytreeCfg() {
  const cfg: FancytreeCfg = {
    selectMode: 1,
    // 点击时触发
    activate: function (_:any, data:any) {
      const activeNode = data.node;
      Storage.set<{key:string,folder:boolean}>('activeNode', {
        key: activeNode.key,
        folder: activeNode.folder,
      })
    },
    source: [],
  };
  const lazyLoad = true
  if (lazyLoad) {
    cfg["source"] = loadRootNode();
    cfg["lazyLoad"] = loadNode;
  } else {
    const tree = await buildTree();
    cfg["source"] = await listAdapter(tree.children);
  }
  return cfg;
}

// 显示侧边栏
async function renderView() {
  const cfg = await buildFancytreeCfg();
  onDomReady("div.content--cklK-", function () {
    $("#root > div > div.page--3indT > div.content--cklK-")
      .append(FancyTree());

    $('.tree').fancytree(cfg);
    $(".content--cklK-").css("position", "relative");
  });
}

function initTag() {
  onDomReady("div.banner--3rtM_.banner--sfaVZ", function () {
    $("#root > div > div.page--3indT > div.banner--3rtM_.banner--sfaVZ")
      .append(Tag(renderView));
  });
};

$(function(){
  initConfig()
  initTag()
});
