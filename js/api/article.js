
//获取当前页面文章id
function getArticleId(){
        id = 1;
        var uri = document.location.pathname;
        var re = /^\/article\/([0-9])+$/g;
        if(re.test(uri)){
            id = uri.replace(re,'$1');
        }
        return id;
}

//通过id获取文章内容
function getArticleById(id){
    $.get("/api/article?id=" + getArticleId(),function(data,status){
        if (status == "success"){
            var res = eval(data);
            if(res.length == 0){
                return;
            }
            editor.setValue(res[0].article_content);
            editor.clearSelection(); 
        }
    });
}

//修改文章
function modifyArticle(article){
     $.ajax({url:"/api/article/",type:"PUT",data:JSON.stringify(article),
       success:function(text){
           alert(text);
        },
       error:function(){
           alert("error");
        }
    }	
   );
}

//创建文章
function createArticle(title,func){
    var article = {
        "article_title":title,			
    }
    $.post("/api/article",JSON.stringify(article),function(data,status){
        if (status == "success"){
            var id = data;
            func(id);
            //return id;
            //window.location.href = "/article/" + id;
        }
      });
}

