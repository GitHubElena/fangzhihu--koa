
const Comments=require('../models/comments');
class CommentsCtl{
   async find(ctx){
       //问题列表 分页+模糊查询功能+二级评论
       const {per_page =10}= ctx.query;
       const page=Math.max(ctx.query.page*1,1)-1;
       const perPage=Math.max(per_page *1,1);
       const q=new RegExp(ctx.query.q);
       const {questionId,answerId}=ctx.params;
       const {rootCommentId}=ctx.query;//当前评论id的上一级评论id
       ctx.body=await Comments.find({
           content:q,questionId,answerId,rootCommentId
        })
       .limit(perPage).skip(page*perPage)
       .populate('commentator replyTo');
   }
   async checkCommentsExist(ctx,next){
    const comments=await Comments.findById(ctx.params.id).select('+commentator');
    if(!comments){ctx.throw(404,'评论不存在')};
    //只有删改查答案的时候才检查此逻辑，赞👎不检查
    if(ctx.params.questionId && comments.questionId !== ctx.params.questionId)
    {ctx.throw(404,'该问题下没有此评论')};
    if(ctx.params.answerId && comments.answerId.toString() !==ctx.params.answerId){
        ctx.throw(404,'该答案下没有此评论')
    }
    ctx.state.comments=comments;
    await next();
   }
   async checkCommentator(ctx,next){
     const {comments}=ctx.state;
     if(comments.commentator.toString()!== ctx.state.user._id){
         ctx.throw(403,'无权限操作')
     }
     await next();
   }
   async findById(ctx){
       const {fields =''}=ctx.query;
       const selectFields=fields.split(';').filter(f=>f).map(f=>' +'+ f).join('');
       const comments=await Comments.findById(ctx.params.id)
       .select(selectFields)
       .populate('commentator');
       ctx.body=comments;
   }
   async create(ctx){
       ctx.verifyParams({
           content:{type:'string',required:true},
            rootCommentId:{type:'string',required:false},//上级评论id即当前评论id的父级id
            replyTo:{type:'string',required:false} //上级评论人即需要回复的人
       });
      
       const commentator=ctx.state.user._id; //登陆人
       const {questionId,answerId}=ctx.params;

       const comments=await new Comments(
           {...ctx.request.body,
            commentator,
            questionId,
            answerId
           }).save();
       ctx.body=comments;
   }
   async update(ctx){
       ctx.verifyParams({
           content:{type:'string',required:false}    
       });
       const {content}=ctx.request.body;
       await ctx.state.comments.update({content});
       ctx.body=ctx.state.comments;
    }
    async delete(ctx){
        await Comments.findByIdAndRemove(ctx.params.id);
        ctx.status=204;
    }
    
}

module.exports=new CommentsCtl();