const jsonwebtoken=require('jsonwebtoken');
const User=require('../models/users');
const Question=require('../models/questions');
const Answers=require('../models/answers');
const {secret}=require('../config');
class UsersCtl{
    async find(ctx){
      const {per_page =10}= ctx.query;
      const page=Math.max(ctx.query.page*1,1)-1;
      const perPage=Math.max(per_page *1,1);
      ctx.body= await User.find().limit(perPage).skip(page*perPage);
       
    }
    async findById(ctx){
       //http://localhost:3000/users/5e40f43ac62e7525d0360285?fields=educations;business;following
      const {fields = ''}=ctx.query;
      const selectFields=fields.split(';').filter(f=>f).map(f=>' +'+ f).join('');
      const populateStr=fields.split(';').filter(f=>f).map(f=>{
         if(f ==='employments'){
            return 'employments.company employments.job';
         }
         if(f === 'educations'){
            return 'educations.school educations.major'
         }
         return f;
      }).join(' ');
      const user=await User.findById(ctx.params.id).select(selectFields)
      .populate(populateStr)
      if(!user){ctx.throw(404,'用户不存在');}
      ctx.body=user;

    }
    async create(ctx){
      //参数校验
      ctx.verifyParams({
         name:{type:'string',required:true},
         password:{type:'string',required:true}
      });
      const {name}=ctx.request.body;
      const repeateUser=await User.findOne({name});
      if(repeateUser){ctx.throw(409,'用户已经存在')}
      const user=await new User(ctx.request.body).save();
      ctx.body=user;
    }
    //授权(自己账户只能操作自己，不能操作他人账户)
    async checkOwner(ctx,next){
      if(ctx.params.id !==ctx.state.user._id){
         ctx.throw(403,'没有权限操作非自己用户')
      }
      await next();
    }
    async update(ctx){
       //参数校验
       ctx.verifyParams({
        name:{type:'string',required:false},
        password:{type:'string',required:false},
        avatar_url:{type:'string',required:false},
        gender:{type:'string',required:false},
        headline:{type:'string',required:false},
        locations:{type:'array',itemType:'string',required:false},
        business:{type:'string',required:false},
        employments:{type:'array',itemType:'object',required:false},
        educations:{type:'array',itemType:'object',required:false}
     })
      const user=await User.findByIdAndUpdate(ctx.params.id,ctx.request.body);
      if(!user){ctx.throw(404);}
      ctx.body=user;
    }
    async delete(ctx){
     const user=await User.findByIdAndRemove(ctx.params.id);
     if(!user){ctx.throw(404)};
     ctx.status=204;
    }
    async login(ctx){
      ctx.verifyParams({
         name:{type:'string',required:true},
         password:{type:'string',required:true}
      });
      const user=await User.findOne(ctx.request.body);
      if(!user){ctx.throw(401,'用户名或密码不正确')}
      const {_id,name}=user;
      const token=jsonwebtoken.sign({_id,name},secret,{expiresIn:'1d'});
      ctx.body={token};
    }
    //获取关注者列表
    async listFollowing(ctx){
       //await User.findById(ctx.params.id).select('+following')
       //得到的是关注人id
       //await User.findById(ctx.params.id).select('+following').populate('following');
       //得到的是关注人id以及id关联的所有信息（包含name.password 等等)
       const user=await User.findById(ctx.params.id).select('+following').populate('following');
       if(!user){ctx.throw(404)}
       ctx.body=user.following;
    }
    //获取粉丝列表
    async listFollower(ctx){
       const user=await User.find({following:ctx.params.id});
       ctx.body=user;
    }

    //检查用户存在与否
    async checkUserExist(ctx,next){
     const user=await User.findById(ctx.params.id);
     if(!user){ctx.throw(404,'用户不存在')}
     await next();
    }
    //关注某人
    async follow(ctx){
       //从auth中解析出来的cta.state.user中取得_id
       const me=await User.findById(ctx.state.user._id).select('+following');
       //checking ctx.params.id  is followed
       if(!me.following.map(id=>id.toString()).includes(ctx.params.id)){
          me.following.push(ctx.params.id);
          me.save();
       }
       ctx.status=204;
    }
    //取消关注
    async unfollow(ctx){
      //从auth中解析出来的cta.state.user中取得_id
      const me=await User.findById(ctx.state.user._id).select('+following');
      const index=me.following.map(item=>item.toString()).indexOf(ctx.params.id);
      if(!index>-1){
         me.following.splice(index,1);
         me.save();
      }
      ctx.status=204;
   }
   //关注的话题    
   async followTopic(ctx){    
         //从auth中解析出来的cta.state.user中取得_id
         const me=await User.findById(ctx.state.user._id).select('+followingTopic');
         //checking ctx.params.id  is followed
         if(!me.followingTopic.map(id=>id.toString()).includes(ctx.params.id)){
            me.followingTopic.push(ctx.params.id);
            me.save();
         }
         ctx.status=204;
   }
    //取消关注话题
 async unfollowTopic(ctx){
        //从auth中解析出来的cta.state.user中取得_id
        const me=await User.findById(ctx.state.user._id).select('+followingTopic');
        const index=me.followingTopic.map(item=>item.toString()).indexOf(ctx.params.id);
        if(!index>-1){
           me.followingTopic.splice(index,1);
           me.save();
        }
        ctx.status=204;
   }
 //获取用户关注的话题列表
 async listFollowingTopic(ctx){
      const topic=await User.findById(ctx.params.id).select('+followingTopic').populate('followingTopic');
      if(!topic){ctx.throw(404)}
      ctx.body=topic.followingTopic;
   }
 //获取用户的问题列表
 async listQuestions(ctx){
     const questions=await Question.find({questioner:ctx.params.id});
     ctx.body=questions;
 }
  //获取点赞答案的用户列表
 async listLikingAnswers(ctx){
   const user=await User.findById(ctx.params.id).select('+likingAnswers').populate('likingAnswers');
   if(!user){ctx.throw(404,'用户不存在')}
   ctx.body=user.likingAnswers;
 }
    //对答案就行点赞
 async likeAnswer(ctx,next){    
   //从auth中解析出来的ctx.state.user中取得_id即当前登陆人
   const me=await User.findById(ctx.state.user._id).select('+likingAnswers');
   if(!me.likingAnswers.map(id=>id.toString()).includes(ctx.params.id)){
      me.likingAnswers.push(ctx.params.id);
      me.save();
      await Answers.findByIdAndUpdate(ctx.params.id,{$inc:{voteCount:1}})
   }
   ctx.status=204;
   await next();
 }
 //对答案取消点赞
async unlikeAnswer(ctx){
  //从auth中解析出来的cta.state.user中取得_id
  const me=await User.findById(ctx.state.user._id).select('+likingAnswers');
  const index=me.likingAnswers.map(item=>item.toString()).indexOf(ctx.params.id);
  if(!index>-1){
     me.likingAnswers.splice(index,1);
     me.save();
    
  }
  ctx.status=204;
 }
 //获取👎答案的用户列表
 async listDisikingAnswers(ctx){
   const user=await User.findById(ctx.params.id).select('+dislikingAnswers').populate('dislikingAnswers');
   if(!user){ctx.throw(404,'用户不存在')}
   ctx.body=user.dislikingAnswers;
 }
    //对答案就行👎
 async dislikeAnswer(ctx,next){    
   //从auth中解析出来的ctx.state.user中取得_id即当前登陆人
   const me=await User.findById(ctx.state.user._id).select('+dislikingAnswers');
   if(!me.dislikingAnswers.map(id=>id.toString()).includes(ctx.params.id)){
      me.dislikingAnswers.push(ctx.params.id);
      me.save();
      
   }
   ctx.status=204;
   await next();
 }
 //对答案取消👎
async undislikeAnswer(ctx){
  //从auth中解析出来的cta.state.user中取得_id
  const me=await User.findById(ctx.state.user._id).select('+dislikingAnswers');
  const index=me.dislikingAnswers.map(item=>item.toString()).indexOf(ctx.params.id);
  if(!index>-1){
     me.dislikingAnswers.splice(index,1);
     me.save();
  
  }
  ctx.status=204;
 }
 //获取收藏答案的列表
 async listCollectingAnswers(ctx){
   const user=await User.findById(ctx.params.id).select('+collectingAnswers').populate('collectingAnswers');
   if(!user){ctx.throw(404,'用户不存在')}
   ctx.body=user.collectingAnswers;
 }
 //收藏答案
 async collectAnswer(ctx,next){    
   //从auth中解析出来的ctx.state.user中取得_id即当前登陆人
   const me=await User.findById(ctx.state.user._id).select('+collectingAnswers');
   if(!me.collectingAnswers.map(id=>id.toString()).includes(ctx.params.id)){
      me.collectingAnswers.push(ctx.params.id);
      me.save();
      
   }
   ctx.status=204;
   await next();
 }
 //对答案取消收藏
async unCollectAnswer(ctx){
  //从auth中解析出来的cta.state.user中取得_id
  const me=await User.findById(ctx.state.user._id).select('+collectingAnswers');
  const index=me.collectingAnswers.map(item=>item.toString()).indexOf(ctx.params.id);
  if(!index>-1){
     me.collectingAnswers.splice(index,1);
     me.save();
  
  }
  ctx.status=204;
 }


}
module.exports=new UsersCtl();