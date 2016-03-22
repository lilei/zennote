var fs = require("fs");

$(function(){
	// --- Initialize first Dynatree -------------------------------------------
	$("#tree").dynatree({
		//children: data,
		onActivate: function(node) {
			//$("#echoActive").text(node.data.title + "(" + node.data.key + ")");
			if (node.data.isFolder) {
				return;
			};
			fs.readFile(node.data.key,function(err,data){
                if(err){
                    alert("read file failed");
                }else{
                    //curFile = e.target.data;
                    editor.setValue(String(data));
                }
            }); 
		},
		onDeactivate: function(node) {
			//$("#echoActive").text("-");
		},
		dnd: {
			onDragStart: function(node) {
				//logMsg("tree.onDragStart(%o)", node);
				return true;
			},
			onDragStop: function(node) {
				//logMsg("tree.onDragStop(%o)", node);
			},
			autoExpandMS: 1000,
			preventVoidMoves: true, // Prevent dropping nodes 'before self', etc.
			onDragEnter: function(node, sourceNode) {
				if (node.data.isFolder) {
					return true;
				};
				return false;
			},
			onDragOver: function(node, sourceNode, hitMode) {
				//logMsg("tree.onDragOver(%o, %o, %o)", node, sourceNode, hitMode);
				if(node.isDescendantOf(sourceNode)){
					return false;
				}
			},
			onDrop: function(node, sourceNode, hitMode, ui, draggable) {
				//logMsg("tree.onDrop(%o, %o, %s)", node, sourceNode, hitMode);
				if (!node.data.isFolder) {
					draggable = false;
				}else{
					sourceNode.move(node, hitMode);
					if (!node.bExpanded) {
						node.toggleExpand();
					};
				}
			},
			onDragLeave: function(node, sourceNode) {
				//logMsg("tree.onDragLeave(%o, %o)", node, sourceNode);
			}
		}
	});
	var rootNode = $("#tree").dynatree("getRoot");
	walk("./doc",rootNode);
});


function walk(path,parentNode){
    var files = fs.readdirSync(path);
    for(fn in files){
        var fname = path + "/" + files[fn];  
         var stat = fs.lstatSync(fname);  
         if(parentNode){

         }
         //console.log(files[fn]);  
         //var menu = Menu(parentNode).addSubMenu(files[fn],"fa fa-table fa-fw");
         if(stat.isDirectory() == true){  
         	var childNode = parentNode.addChild({
				title: files[fn],
				isFolder: true, 
				expand: true ,
				key: fname
				});
	        walk(fname,childNode);  
		}else{
			parentNode.addChild({
				title: files[fn],
				isFolder: false,
				key: fname
			});
         }
    }
}
