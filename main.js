
const makeMenus = (dlist) => {
  const nodes = {};
  dlist.nodes.map(obj => nodes[obj.id] = obj);
  chrome.contextMenus.removeAll();

  var rootId = createMenuItem( nodes, 'root', undefined );

  chrome.contextMenus.create({
    type: "separator",
    parentId: rootId
  });
  
  chrome.contextMenus.create({
    title: "Reload Settings and Doc",
    id: 'dynapaste::reload',
    parentId: rootId,
    onclick: () => checkLoadWait(),
    contexts: ['all']
  });
};

const pasteFrom = (nodeId, nodes, evt, tab) => {
  document.oncopy = function(event) {
    event.preventDefault();
    if(nodes[nodeId].note && nodes[nodeId].note !== "")
      event.clipboardData.setData("text/plain", nodes[nodeId].note);
    else
      event.clipboardData.setData("text/plain", nodes[nodeId].content);
  };
  document.execCommand("copy", false, null);
  chrome.tabs.getCurrent((tab) => tab.execCommand("paste", false, null) );
  
};

const createMenuItem = (nodes, nodeId, parentId) => {
  if(!nodes[nodeId].content)
    return;
  var menuId = chrome.contextMenus.create({
    title: nodes[nodeId].content,
    id: 'dynapaste::' + nodes[nodeId].id,
    parentId: parentId,
    onclick: (evt, tab) => pasteFrom(nodeId, nodes, evt),
    contexts: ['all']
  });
  if(nodes[nodeId].children)
    nodes[nodeId].children.map(childId => createMenuItem(nodes, childId, menuId) )
  return menuId;
};

function checkLoadWait(){
  chrome.storage.sync.get(['devkey', 'sourcedoc'], loadUp);
}

checkLoadWait();

function loadUp(options){
  fetch("https://dynalist.io/api/v1/doc/read", {
    method: "POST",
    body: JSON.stringify({
        "token": options.devkey,
        "file_id": options.sourcedoc
    })
  }).then(response => response.json()).then(makeMenus);
}

