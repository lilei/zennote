
//��ȡ��ǰҳ������id
function getArticleId(){
        id = 1;
        var uri = document.location.pathname;
        var re = /^\/article\/([0-9])+$/g;
        if(re.test(uri)){
            id = uri.replace(re,'$1');
        }
        return id;
}

//ͨ��id��ȡ��������
function getArticleById(id){
    var test = "#title \nblablabla";
    for(var i = 0;i < 50;i++){
        test = test + "\n#title \nblablabla";
    }
    editor.setValue(test);
    editor.clearSelection();
}

//�޸�����
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

//��������
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

