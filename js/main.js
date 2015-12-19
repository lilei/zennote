var fs = require("fs");

var curFile;


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
            var menu = addDir(parentNode,files[fn]);
            walk(fname,menu);  
         }
    }
}


onload = function(){
    ace.require("ace/ext/language_tools");
    editor.setTheme("ace/theme/github");
    editor.getSession().setMode("ace/mode/markdown");
    editor.setShowPrintMargin(false);
    document.getElementById('editor').style.fontSize='14px';

    editor.setOptions({ 
        enableBasicAutocompletion: true, 
        enableSnippets: true, 
        enableLiveAutocompletion: false 
    }); 
    /*var btnNewType = addMenu("新建分类",sideMenu);

    //新建分类按钮
    $(btnNewType).click (
            function(){
                $('#add-type-modal').modal({
                  keyboard: true
                });
            }
    );
    */
    Menu(sideMenu).addSubMenu("新建分类","fa fa-edit fa-fw",function(){
        $('#add-type-modal').modal({
          keyboard: true
        });
    });
    walk("./doc",sideMenu);

    $(function() {
        $('#side-menu').metisMenu();
    });

}



var article_api = "js/api/article.js";
if (location.href.indexOf("?dev") > 0) {
    article_api = "js/api/article_mock.js" 
}

$.getScript(article_api,function(){
    getArticleById(getArticleId());
;});

var render = document.getElementById("render");
render.innerHTML = marked(editor.getValue());
drawTimeLine();
editor.getSession().on('change', function(e) {
    render.innerHTML = marked(editor.getValue(),{ 
        renderer: new marked.Renderer(), 
        gfm: true, 
        tables: true, 
        breaks: true, 
        pedantic: false, 
        sanitize: true, 
        smartLists: true, 
        smartypants: true, 
        highlight: function (code) { 
        //return hljs.highlightAuto(code).value; 
        } 
        });
        drawTimeLine();
});


//绘制timeline
function drawTimeLine()
{
    var lineList = $(".timeline");
    for(i = 0;i < lineList.length;i++){
        var t = lineList[i];
        try
        {
            
            var data = eval( t.innerText);
            t.innerText = "";
            var timeLine = new vis.Timeline(t,data,{});	
        }
        catch(e)
        {
            
        }
    }
}
