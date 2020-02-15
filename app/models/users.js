const mongoose=require('mongoose');
const {Schema,model}=mongoose;

//collection schema
const userSchema= new Schema({
    __v:{type:Number,select:false},
    name:{type:String,required:true},
    password:{type:String,require:true,select:false},
    avatar_url:{type:String},
    gender:{type:String,enum:['male','female'],default:'male',required:true,select:false},
    headline:{type:String},
    locations:{type:[{type:Schema.Types.ObjectId,ref:'Topic'}],select:false},
    business:{type:Schema.Types.ObjectId,ref:'Topic',select:false},
    employments:{
        type:[
            {
            company:{type:Schema.Types.ObjectId,ref:'Topic'},
            job:{type:Schema.Types.ObjectId,ref:'Topic'}
           }
        ],
        select:false
    },
    educations:{
       type:[
           {
            school:{type:Schema.Types.ObjectId,ref:'Topic'},
            major:{type:Schema.Types.ObjectId,ref:'Topic'},
            diploma:{type:Number,enum:[1,2,3,4,5]},
            entrance_year:{type:Number},
            graducation_year:{type:Number}
           }
       ],
       select:false
    },
    //关注的用户
    following:{
        type:[{ 
              type:Schema.Types.ObjectId,             
              ref:'User'//ObjectId下的相关联的一切信息都可以获取，添加引用ref主要是关联user 
             }],
        select:false
    },
    //专注的话题
    followingTopic:{
        type:[{ 
            type:Schema.Types.ObjectId,             
            ref:'Topic'
           }],
      select:false
  },
  likingAnswers:{
    type:[{ 
        type:Schema.Types.ObjectId,             
        ref:'Answer'
       }],
  select:false
  },
  dislikingAnswers:{
    type:[{ 
        type:Schema.Types.ObjectId,             
        ref:'Answer'
       }],
  select:false
  },
  collectingAnswers:{
    type:[{ 
        type:Schema.Types.ObjectId,             
        ref:'Answer'
       }],
  select:false
  }
    

},{timestamps:true});

module.exports=model('User',userSchema);