const Router=require('koa-router');
const jwt=require('koa-jwt');
const router=new Router({prefix:'/questions/:questionId/answers'});
const {find,checkAnswerExist,checkAnswers,
    findById, create,update,delete:del}
    =require('../controllers/answers');
const {secret}=require('../config');
const auth=jwt({secret});

router.get('/',find);
router.post('/',auth,create);
router.get('/:id',checkAnswerExist,findById);
router.patch('/:id',auth,checkAnswerExist,checkAnswers,update);
router.delete('/:id',auth,checkAnswerExist,checkAnswers,del);


module.exports=router;