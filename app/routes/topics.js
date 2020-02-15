const jwt=require('koa-jwt');
const Router=require('koa-router');
const router=new Router({prefix:'/topics'});
const {find,findById,checkTopicExist,create,update,
    listFollowerTopic,listQuestions}
    =require('../controllers/topics');
const {secret}=require('../config');
const auth=jwt({secret});

router.get('/',find);
router.post('/',auth,create);
router.get('/:id',checkTopicExist,findById);
router.patch('/:id',auth,checkTopicExist,update);
//获取某话题的粉丝列表
router.get('/:id/followerTopic',checkTopicExist,listFollowerTopic);
//获取某话题下的问题列表
router.get('/:id/listquestions',checkTopicExist,listQuestions);

module.exports=router;