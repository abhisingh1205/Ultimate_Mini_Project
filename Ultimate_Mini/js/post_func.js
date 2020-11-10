$(document).ready(()=>{

    
    function likesFunc(){
        alert("Working")
    }
    var single_post_array;
    var all_users_array;
    var userName_posted;
    var current_postId;

    sessionStorage.setItem("blogit_userId","3");
    sessionStorage.setItem("blogit_userName","Rachel")

    var current_userID=Number(sessionStorage.getItem("blogit_userId"))
    var current_userName=sessionStorage.getItem("blogit_userName")

    // TO GET ALL USERS
    $.ajax({
        url:"http://localhost:3333/users",
        type:"GET",
        success:(users)=>{
            all_users_array=users
            console.log(all_users_array);
            
        }
    })
    
    
    // TO GET SINGLE PAGE BLOG DATA
    $.ajax({
        url:"http://localhost:3333/posts?id=2",
        type:"GET",
        success:(post)=>{


            
            single_post_array=post[0];
            current_postId=single_post_array.id
            
            
            //TO APPEND DYNAMICALL ALL BLOG'S DATA 

            $("#Blog-Title").html(single_post_array.postTitle)
            // $('<img src="'+single_post_array.url+'" class="post-image">').appendTo(".post-container")
            
            $("#postDate").html(single_post_array.postDate)
            // $('<h5>Category : '+single_post_array.category+'</h5>').appendTo(".post-container")

            console.log(all_users_array);
            
            //TO DISPLAY NAME OF BLOG OWNER
            for(let i=0;i<all_users_array.length;i++)
            {
                if(single_post_array.userId == all_users_array[i].id)
                {
                    userName_posted=all_users_array[i].userName
                    break
                }
                else
                {
                    userName_posted="Unknown"
                }
    
            }

            $("#author").html(userName_posted)
            $("#postImage").attr("src",single_post_array.url);
            $("#contentId").html(single_post_array.content)

            // $('<h5>Created By : '+userName_posted+'</h5>').appendTo("#author")
            // $('<p>'+ single_post_array.content +'</p>').appendTo(".post-container")
        }
    })

    //TO GET ALL LIKE ARRAY
    $.ajax({
        url:"http://localhost:3333/likes",
        type:"GET",
        success:(likes)=>{
            console.log(likes);
            var likes_on_post=0;
            var liked_flag=0;

            //CALCULATE LIKES ON CURRENT POST
            for(let i=0;i < likes.length;i++)
            {
                if(likes[i].postId == current_postId)
                {
                    likes_on_post++
                }
            }

            // $('<h6>Likes '+likes_on_post+'</h6>').appendTo(".likes-container");

            $("#likesCountId").html(likes_on_post+"&nbsp;&nbsp;")

            for(let i=0;i <likes.length;i++)
            {
                if(current_userName == likes[i].userName)
                {
                    liked_flag=1
                    break;
                }
            }

            if(liked_flag == 1)
            {
                $('<button class="btn-primary" id="likebtn" value="Unlike">Unlike<button>').prependTo("#likes-container")
            
            }
            else
            {
                $('<button class="btn-primary" id="likebtn" value="Like">Like<button>').prependTo("#likes-container")
                
            }

        
            //TO LIKE AND UNLIKE
            $('#likebtn').click(()=>{

                //IF NO OBJECT IN DB THEN DO LIKE--POST CALL
                if($('#likebtn').html() == "Like")
                {
                    
                    
                    $.ajax({
                        url:"http://localhost:3333/likes",
                        type:"POST",
                        contentType:"application/json",
                        data:JSON.stringify({postId:current_postId,userName:current_userName,userId:current_userID}),
                        success:(data)=>{
                            console.log(data);
                            
                            $('#likebtn').html("Unlike")
                            location.reload(true);
                            

                        }
                        
                    })
                }

                //IF ALREADY LIKED THEN DISLIKE--DELETE CALL
                else
                {
                    $.ajax({
                        url:"http://localhost:3333/likes/" + likes.length,
                        type:"DELETE",
                        success:(msg)=>{
                            console.log(msg);
                            
                        }
                    })

                    location.reload(true);
                }
                
            })
            
        }
    })
    
    // TO GET ALL COMMENTS
    $.ajax({
        url:"http://localhost:3333/comments",
        type:"GET",
        success:(comments)=>{
            console.log(comments);
            
            var comment_counter=0;
            //TO DISPLAY ALL COMMENTS
            for(let i=0;i<comments.length;i++)
            {
                // debugger
                if(comments[i].postId==current_postId)
                {
                    // debugger;
                    comment_counter++;
                    console.log(comments[i]);
                     
                    $('<div class="well single-comment" id="commentid'+i+'"></div>').appendTo(".comments-container")

                    $('<h6>'+ comments[i].userName +'</h6>').appendTo('#commentid'+i)
                    $('<p>'+ comments[i].comment +'</p>').appendTo('#commentid'+i)

                }
            }

            $("#commentCount").html(comment_counter)

            $('<div class="post-comments"><h6>Post Your Comment</h6></div>').appendTo(".comments-container")
            $('<input type="text" class="input-post-comment">').appendTo(".post-comments")
            $('<button class="post-btn btn-primary">Post Comment</button>').appendTo(".post-comments")

            

            //TO POST COMMENT---JQUERY POST CALL
            $(".post-btn").click(()=>{

                var curent_comment=$(".input-post-comment").val();

                var comment_obj=JSON.stringify({postId:current_postId,userId:current_userID,userName:current_userName,comment:curent_comment})

                $.ajax({
                    url:"http://localhost:3333/comments",
                    type:"POST",
                    data:comment_obj,
                    contentType:"application/json",
                    success:(data)=>{
                        alert("Success")
                    }
                    
                })
            })


            
        }
    })


})