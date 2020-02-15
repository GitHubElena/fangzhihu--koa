const Router=require('koa-router');
const jwt=require('koa-jwt');
const router=new Router({prefix:'/questions/:questionId/answers/:answerId/comments'});
const {find,checkCommentsExist,checkCommentator,
    findById, create,update,delete:del}
    =require('../controllers/comments');
const {secret}=require('../config');
const auth=jwt({secret});

router.get('/',find);
router.post('/',auth,create);
router.get('/:id',checkCommentsExist,findById);
router.patch('/:id',auth,checkCommentsExist,checkCommentator,update);
router.delete('/:id',auth,checkCommentsExist,checkCommentator,del);


module.exports=router;