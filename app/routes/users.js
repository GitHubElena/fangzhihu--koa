// const jsonwebtoken=require('jsonwebtoken');
const jwt=require('koa-jwt')
const Router=require('koa-router');
const router=new Router({prefix:"/users"});
const { find,findById,create,update,delete:del,
    login,checkOwner,listFollowing,listFollower,
    checkUserExist,follow,unfollow,followTopic,
    unfollowTopic,listFollowingTopic,listQuestions,
    listLikingAnswers,likeAnswer,unlikeAnswer,
    listDisikingAnswers,dislikeAnswer,undislikeAnswer,
    listCollectingAnswers,collectAnswer,unCollectAnswer
} 
    =require('../controllers/users');
const {checkTopicExist} =require('../controllers/topics');
const {checkAnswerExist}=require('../controllers/answers');
const {secret} =require('../config');
// const auth=async(ctx,next)=>{
//   const {authorization =''}=ctx.request.header;
//   const token = authorization.replace('Bearer ','');

//   try{
//     const user=jsonwebtoken.verify(token,secret);
//     ctx.state.user=user;
//   }catch(err){
//     ctx.throw(401,err.message);
//   }
//   await next();
// }

//user认证  第三方插件
const auth=jwt({secret});
router.get('/',find);
router.post('/',create);
router.get('/:id',findById);

router.patch('/:id',auth,checkOwner,update);
//先认证后授权再操作其他
router.delete('/:id',auth,checkOwner,del);  
router.post('/login',login);
router.get('/:id/following',listFollowing);//获取关注者
router.get('/:id/follower',listFollower);//获取粉丝
router.get('/:id/followingTopic',listFollowingTopic);//获取用户关注的话题列表
router.put('/follow/:id',auth,checkUserExist,follow);//（点击关注用户 ） 
router.delete('/unfollow/:id',auth,checkUserExist,unfollow)//取消关注用户
router.put('/followTopic/:id',auth,checkTopicExist,followTopic);//（点击关注话题 ） 
router.delete('/unfollowTopic/:id',auth,checkTopicExist,unfollowTopic)//取消关注话题
router.get('/:id/listquestions',listQuestions)//获取问题列表

//zan and cai 形成互斥关系
//zan
router.get('/:id/likingAnswers',listLikingAnswers);//获取用户赞过的答案
//赞了之后踩就减少（互斥）
router.put('/likingAnswers/:id',auth,checkAnswerExist,likeAnswer,undislikeAnswer);//对答案点赞
router.delete('/likingAnswers/:id',auth,checkAnswerExist,unlikeAnswer);//对答案取消点赞
//cai
router.get('/:id/dislikingAnswers',listDisikingAnswers);
//踩了之后赞就增加（互斥）
router.put('/dislikingAnswers/:id',auth,checkAnswerExist,dislikeAnswer,unlikeAnswer);//对答案踩
router.delete('/dislikingAnswers/:id',auth,checkAnswerExist,undislikeAnswer);//对答案取消踩

//收藏
router.get('/:id/listCollectingAnswers',listCollectingAnswers);//获取收藏答案的列表
router.put('/collectAnswer/:id',auth,checkAnswerExist,collectAnswer);//对答案收藏
router.delete('/unCollectAnswer/:id',auth,checkAnswerExist,unCollectAnswer);//对答案取消收藏

module.exports=router;