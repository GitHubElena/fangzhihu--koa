
const Answers=require('../models/answers');

class AnswerCtl{
   async find(ctx){
       //问题列表 分页+模糊查询功能
       const {per_page =10}= ctx.query;
       const page=Math.max(ctx.query.page*1,1)-1;
       const perPage=Math.max(per_page *1,1);
       const q=new RegExp(ctx.query.q);
       ctx.body=await Answers
       .find({content:q,questionId:ctx.params.questionId})
       .limit(perPage).skip(page*perPage);
   }
   async checkAnswerExist(ctx,next){
    const answer=await Answers.findById(ctx.params.id).select('+answerer');
    if(!answer){ctx.throw(404,'答案不存在')};
    //只有删改查答案的时候才检查此逻辑，赞👎不检查
    if(ctx.params.questionId && answer.questionId !== ctx.params.questionId){ctx.throw(404,'该问题下没有此答案')};
    ctx.state.answer=answer;
    await next();
   }
   async checkAnswers(ctx,next){
     const {answer}=ctx.state;
     if(answer.answerer.toString()!== ctx.state.user._id){
         ctx.throw(403,'无权限操作')
     }
     await next();
   }
   async findById(ctx){
       const {fields =''}=ctx.query;
       const selectFields=fields.split(';').filter(f=>f).map(f=>' +'+ f).join('');
       const answers=await Answers.findById(ctx.params.id)
       .select(selectFields)
       .populate('answerer');
       ctx.body=answers;
   }
   async create(ctx){
       ctx.verifyParams({
           content:{type:'string',required:true}      
       });
      
       const answerer=ctx.state.user._id; //登陆人
       const questionId=ctx.params.questionId;
       const answers=await new Answers(
           {...ctx.request.body,
            answerer,
            questionId
           }).save();
       ctx.body=answers;
   }
   async update(ctx){
       ctx.verifyParams({
           content:{type:'string',required:false}    
       });
       await ctx.state.answer.update(ctx.request.body);
       ctx.body=ctx.state.answer;
    }
    async delete(ctx){
        await Answers.findByIdAndRemove(ctx.params.id);
        ctx.status=204;
    }
    
}

module.exports=new AnswerCtl();