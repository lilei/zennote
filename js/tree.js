var fs = require("fs");

var gui = require("nw.gui");
gui.Window.get().show();

var curFile;
var rootDir = "./doc";

$(function(){
	// --- Initialize first Dynatree -------------------------------------------
	$("#tree").dynatree({
		//children: data,
		onActivate: function(node) {
			//$("#echoActive").text(node.data.title + "(" + node.data.key + ")");
			saveCurFile();
			if (node.data.isFolder) {
				return;
			};
			fs.readFile(node.data.key,function(err,data){
                if(err){
                    alert("read file failed");
                }else{
                    //curFile = e.target.data;
                    editor.setValue(String(data));
                    setCurFile(node);
                }
            }); 
		},
		onDeactivate: function(node) {
			//$("#echoActive").text("-");
		},

		onCreate: function(node, span){
				bindContextMenu(node,span);
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
					return;
				}
				var destPath = node.data.key;
				switch(hitMode){
					case "over": 
						destPath = node.data.key;
						break;
					case "after":
						if (node.bExpanded) {
							destPath = node.data.key;
							hitMode = "over";
							break;
						};
					case "before": 
						var parent = node.getParent();
						destPath = parent.data.key;
				}
				fs.rename(sourceNode.data.key,destPath + "/" + sourceNode.data.title,function(err){
					if (err) {
							alert("move doc failed");
						}else{
							sourceNode.move(node, hitMode);
							sourceNode.data.key = node.data.key + "/" + sourceNode.data.title;
							if (!node.bExpanded) {
								node.toggleExpand();
							}
						}
				});
			},
			onDragLeave: function(node, sourceNode) {
				//logMsg("tree.onDragLeave(%o, %o)", node, sourceNode);
			}
		}
	});
	var rootNode = $("#tree").dynatree("getRoot");
	rootNode.data.key = "./doc";
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

function bindContextMenu(node,span) {
	span.addEventListener('contextmenu', function(ev){
        var menu = new gui.Menu();
		if (node.data.isFolder) {
            menu.append(new gui.MenuItem({ icon: 'img/edit.png', label: '新建',click:function(){
            	node.activate();
                $('#add-note-modal').modal({
                  keyboard: true
	            });
            } }));
		};
            menu.append(new gui.MenuItem({ icon: 'img/cut.png', label: '删除',click:function(){
            		var delFunc = null;
            		if (node.data.isFolder) {
            			delFunc = fs.rmdir;
            		}else{
            			delFunc = fs.unlink;
            		}
                    delFunc(node.data.key,function(err){
                        if(err){
                           alert(err); 
                        }else{
                        	node.remove();
                        }
                    })
                } 
            }));
            menu.popup(ev.x,ev.y);
            ev.stopPropagation();
            return false;
        },false);
};

function setCurFile(node){
    $(document).attr("title",node.data.title + " -zennote");
	curFile = node.data.key;
	node.activate();
}

function getCurfile(){
	return curFile;
}

function saveCurFile(){
	if (!curFile) {
		return;
	};
	fs.writeFile(curFile,editor.getValue(),function(err){
        if(err){
        	alert(err);
        };
    });
}
