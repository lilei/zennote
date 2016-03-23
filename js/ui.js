
var editor = editor = ace.edit("editor");    //editor
var gui = require("nw.gui");
gui.Window.get().show();

//增加命令
function addCommand(btn,bindKey,desc,func){
    $(btn).click (func);
    $(btn).attr("title",desc + " " + bindKey);
    editor.commands.addCommand({
    name: bindKey,
    bindKey:{win: bindKey,mac: bindKey},
    exec:func,
    readOnly:true
    })
}



//显示/隐藏侧边栏
function showSideMenu(){
        if ($("#slider").get(0).style.display == "none") {
            $("#slider").show();
            $("#left").css("paddingLeft",250);
            $("#editor").css("width",$("#editor").get(0).offsetWidth - 250);
            //$(".dir")[0].setFocus();
        }else{
            $("#slider").css("display","none");
            $("#left").css("paddingLeft",0);
            $("#editor").css("width","50%");
        }
    }

//显示侧边栏
addCommand("#btn-slider",
        "Ctrl-M",
        "菜单",
        showSideMenu
);

 $(document).bind('keydown.Ctrl_m',function (evt){
        showSideMenu();
        return false; 
    });


//保存
addCommand("#btn-save",
        "Alt-S",
        "保存",
        function(){
            saveCurFile();
        }
);

//粗体
addCommand("#btn-bold",
        "Ctrl-B",
        "粗体",
        function(){
            var range = editor.getSelectionRange();
            var text = editor.session.getTextRange(range);
            editor.session.insert(range.end,"**");
            editor.session.insert(range.start,"**");
        }
);

//斜体
addCommand("#btn-em",
        "Ctrl-E",
        "斜体",
        function(){
            var range = editor.getSelectionRange();
            var text = editor.session.getTextRange(range);
            editor.session.insert(range.end,"*");
            editor.session.insert(range.start,"*");
        }
);

//插入链接
addCommand("#btn-link",
        "Ctrl-L",
        "插入链接",
        function(){
            $('#link-modal').modal({
              keyboard: true
            });
        }
);

$('#link-modal').on('shown.bs.modal', function (e) {
    $('#link-input').focus();
})

$('#link-modal').on('hidden.bs.modal', function (e) {
    editor.focus();
})

//插入代码样例
addCommand("#btn-code",
        "Ctrl-K",
        "代码样例",
        function(){
            var range = editor.getSelectionRange();
            var text = editor.session.getTextRange(range);
            editor.session.insert(range.end,"`");
            editor.session.insert(range.start,"`");
        }
) ;

//VIM模式
addCommand("#btn-vim-mod",
        "Esc",
        "VIM模式",
        function(){
            editor.setKeyboardHandler("ace/keyboard/vim");
            editor.focus();
        }
);

//普通模式
addCommand("#btn-normal-mod",
        "Ctrl-N",
        "普通模式",
        function(){
            editor.setKeyboardHandler("");
            editor.focus();
        }
);

addCommand("#btn-new",
        "Alt-C",
        "新建文档",
        function(){
          $('#add-note-modal').modal({
                  keyboard: true
            });
        }
);


//调试模式
addCommand("#btn-dev-mod",
        "F12",
        "调试模式",
        function(){
            var win = gui.Window.get();
            if (win.isDevToolsOpen()) {
              win.closeDevTools();
            } else {
              win.showDevTools();
            }
        }
);


//增加菜单项
function addMenu(menuName,parentNode,data){
    var li = $("<li>").get(0);
    var i = $("<i>", {class: "fa fa-table fa-fw"}).get(0);
    var a = $("<a>").get(0);

    //设置焦点
    li.setFocus = function(){
        a.focus();
    }

    //获取子节点
    li.getSubLi = function(){
        var ul = $(li).children("ul");
        if (ul.length < 1) {
            return null;
        };
        var subLi = $(ul).children("li");
        if (subLi.length < 1) {
            return null 
        };
        return subLi[0];
    }

    //获取父节点
    li.getParentLi = function(){
        var parentLi = $(li).parent().parent();
        if (parentLi.length < 1) {
            return null;
        };
        return parentLi[0];
    }

    //获取下一个节点
    li.getNextLi = function(){
       var sib =  $(li).next();
       if (sib.length < 1) {
            return null;
       }
       return sib[0];
    }


    //获取上一个节点
    li.getPrevLi = function(){
       var sib =  $(li).prev();
       if (sib.length < 1) {
            return null;
       }
       return sib[0];
    }


     $(a).bind('keydown.j',function (evt){
            var next = null;
            if ($(li).hasClass("active")) {
                next = li.getSubLi();
                if (null == next) {
                    next = li.getNextLi();
                };
            }else{
                next = li.getNextLi();
                if (null == next) {
                    var parentLi = li.getParentLi();
                    next = parentLi.getNextLi();
                };
            }
            if (next) {
                next.setFocus();
            };
            return false; 
        });

     $(a).bind('keydown.k',function (evt){
            var prev = li.getPrevLi();
            if (null == prev) {
                prev = li.getParentLi();
            };
            if (prev) {
                prev.setFocus();
            };
            return false; 
        });


    a.appendChild(i);
    a.innerHTML = a.innerHTML + menuName;
    a.href = "#";
    if(data){
        a.data = data;
        li.onclick = function(e){
            if(e.target.data){
                    fs.readFile(e.target.data,function(err,data){
                        if(err){
                            console.log("read file failed");
                        }else{
                            curFile = e.target.data;
                            editor.setValue(String(data));
                        }
                    }); 
            }
        };
        li.addEventListener('contextmenu', function(ev){
            var menu = new gui.Menu();
            menu.append(new gui.MenuItem({ icon: 'img/cut.png', label: '删除',click:function(){
                    fs.unlink(ev.target.data,function(err){
                        if(err){
                           alert(err); 
                        }else{
                            $(li).remove();
                        }
                    })
                } 
            }));
            menu.popup(ev.x,ev.y);
            ev.stopPropagation();
            return false;
        },false);
    }
    else{
        var span = $("<span>",{class:"fa arrow"}).get(0);
        a.appendChild(span);
        li.className = "dir";
        li.addEventListener('contextmenu',function(ev){
            var dirMenu = new gui.Menu();
            $("#note-input").get(0).dirPath = "./doc/" + menuName;
            $("#note-input").get(0).dirNode = li;
            dirMenu.append(new gui.MenuItem({ icon: 'img/edit.png', label: '新建日志',click:function(){
                $('#add-note-modal').modal({
                  keyboard: true
            });
            } }));
            dirMenu.append(new gui.MenuItem({ icon: 'img/cut.png', label: '删除',click:function(){
                fs.rmdir("./doc/" + menuName,function(err){
                    if(err){
                        alert(err);
                    }else{
                        $(li).remove();
                    }
                });
            } }));
            dirMenu.popup(ev.x,ev.y);
            ev.stopPropagation();
            return false;  
        },false);
    }

    li.appendChild(a);
    parentNode.appendChild(li);
    return li;
}


//增加子菜单项
function addSubMenu(parentNode,key,value){
    var ul = $("<ul>",{class:"nav nav-second-level"}).get(0);
    parentNode.appendChild(ul);
    return ul;
}


//新建分类按钮
$("#btn-add-type").click (
        function(){
            $('#add-type-modal').modal({
              keyboard: true
            });
        }
);

$('#add-type-modal').on('shown.bs.modal', function (e) {
    $('#type-input').focus();
})

$("#btn-add-type-save").click(function(){
    var node = $("#tree").dynatree("getActiveNode");
    if(!node || !node.data.isFolder){
        node = $("#tree").dynatree("getRoot");
    }
    var noteName = $("#type-input").get(0).value;
    var fullPath = node.data.key + "/" + noteName;
    fs.mkdir(fullPath,function(err){
        if(err){
            alert(err);
        }else{
            var newNode = node.addChild({
                title:noteName,
                key: fullPath,
                isFolder: true
                });
                newNode.activate();
        }
    });
    $('#add-type-modal').modal("hide");
});



$("#btn-add-note-save").click(function(){
    var node = $("#tree").dynatree("getActiveNode");
    if(!node || !node.data.isFolder){
        node = $("#tree").dynatree("getRoot");
    }
    var noteName = $("#note-input").get(0).value;
    var fullPath = node.data.key + "/" + noteName;
    fs.open(fullPath,"w+",function(err){
        if(err){
            alert(err);
        }else{
            var newNode = node.addChild({
                title:noteName,
                key: fullPath,
                isFolder: false
                });
                $(document).attr("title",noteName + " -zennote");
                newNode.activate();
            editor.setValue("");
        }
    });
    $('#add-note-modal').modal("hide");
});





//同步滚动
editor.getSession().on("changeScrollTop", function(num){
    var left = $(".ace_scrollbar-v").get(0);
    var right = $("#render").get(0);
    percentage = num / (left.scrollHeight - left.offsetHeight);
    right.scrollTop = Math.round(percentage * (right.scrollHeight - right.offsetHeight));
    //$("#render").scrollTop(top);
});

editor.getSession().setUseWrapMode(true);

var dragging = false;
var iX, iY;
$("#mahua-spliter").mousedown(function(e) {
    dragging = true;
    iX = e.clientX - this.offsetLeft;
    this.setCapture && this.setCapture();
    return false;
});
document.onmousemove = function(e) {
    if (dragging) {
        var e = e || window.event;
        var a = $("#mahua-spliter").css("left");
        $("#editor").css("width", a);
        $("#render").css("width", $(window).innerWidth() - parseInt(a));
        $("#render").css("marginLeft", a);
        var oX = e.clientX - iX;
        $("#mahua-spliter").css({"left":oX + "px"});
        return false;
    }
};
$(document).mouseup(function(e) {
    if(dragging){
        dragging = false;
        editor.resize();
        $("#mahua-spliter")[0].releaseCapture();
        e.cancelBubble = true;
    }
})


//窗口事件
$(window).resize(function() {
});
