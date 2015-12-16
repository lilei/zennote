
var gui = require("nw.gui");
gui.Window.get().show();

var sideMenu = $("#side-menu").get(0);    //左边菜单

//the class of menu
function Menu(node){
    this.node = node;
    this.getParent = function(){
        return this.parentNode;
    }

    var li = $("<li>").get(0);
    var a = $("<a>").get(0);
    var ul = null;
    var contextMenu = null;
    this.addSubMenu = function(menuName,menuClass,func){
        if (!hasChild()) {
            ul = addUl();
            addArrow();
        };
        var i = $("<i>", {class: menuClass}).get(0);
        a.appendChild(i);
        a.innerHTML = a.innerHTML + menuName;
        a.href = "#";
        li.appendChild(a);
        ul.appendChild(li);
        li.className = "dir";
        if (func) {
            li.onclick = func;
        };
        return li;
    }

    this.addContexMenu = function(tag,disp,func){
        if (!contextMenu) {
            contextMenu= new gui.Menu();
            node.addEventListener('contextmenu', function(ev){
                contextMenu.popup(ev.x,ev.y);
                ev.stopPropagation();
                return false;
            },false);
        };
        contextMenu.append(new gui.MenuItem({ icon: tag, label: disp,click:func}));
    }

    this.addSubNode = function(){
    }

    this.getNextMenu = function(){

    }

    this.getPreMenu = function(){
    }

    this.setFocus = function(){
        a.focus();
    }

    this.hasChild = function(){
        if ($(li).children("ul").length == 0) {
            return false;
        }else{
            ul = $("ul").get(0);
            return true;
        }
    }
    this.addUl = function(){
        var ul = $("<ul>",{class:"nav nav-second-level"}).get(0);
        node.appendChild(ul);
        return ul;
    }

    this.addArrow = function(){
        if (node.tagName == "LI") {
            var span = $("<span>",{class:"fa arrow"}).get(0);
            if ($(node).children("a").length > 0) {
                var node_a = $(node).children("a").get(0);
                if ($(node_a).children("span").length == 0) {
                    node_a.appendChild(span);
                };
            };
        };
    }

    this.hasParent = function(){

    }


    this.createLi = function(menuName,menuClass){
        var li = $("<li>").get(0);
        var a = createA(menuName,menuClass);
        li.appendChild(a);

    }
    this.createA = function(display,className){
        var a = $("<a>").get(0);
        a.herf = "#";
        var i = $("<i>", {class: className}).get(0);
        a.appendChild(i);
        a.innerHTML = a.innerHTML + display;
        return a;
    }
    return this;
}


//侧边栏
var sideMenu = $("#side-menu").get(0);    //左边菜单


//显示/隐藏侧边栏
function showSideMenu(){
    if ($("#slider").get(0).style.display == "none") {
        $("#slider").show();
        $("#left").css("paddingLeft",250);
        $("#editor").css("width",$("#editor").get(0).offsetWidth - 250);
        $(".dir")[0].setFocus();
    }else{
        $("#slider").css("display","none");
        $("#left").css("paddingLeft",0);
        $("#editor").css("width","50%");
    }
}


sideMenu.addMenu = function(menuName,menuClass){
    var li = $("<li>").get(0);
    var i = $("<i>", {class: menuClass}).get(0);
    var a = $("<a>").get(0);
    a.appendChild(i);
    a.innerHTML = a.innerHTML + menuName;
    a.href = "#";
    li.appendChild(a);
    sideMenu.appendChild(li);

    //下级菜单按钮
    li.addArrow = function(){
	    var span = $("<span>",{class:"fa arrow"}).get(0);
	    a.appendChild(span);
    }


    return li;
}

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

