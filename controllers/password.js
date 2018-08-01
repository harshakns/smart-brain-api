const nodeMailer = require('nodemailer');

const handlePassRecReq=(req, res, db) => {
    console.log('handlePassRecReq')
    const {email} = req.body;
    console.log(email);
    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'testlabrat1729@gmail.com',
            pass: 'Nodemailer12!@'
        }
    });
    const getRandomCode=(n)=>{
        let temp ='A';
        for(let i=0; i<n;i++){
            temp += String(Math.floor(Math.random() * Math.floor(9)));

        }
        return temp+='z'

    }
    const code = String(getRandomCode(10));
    console.log(code);
    const mailOptions = {
        from: 'testlabrat1729@gmail.com',
        to: `${email}`,
        subject: 'password recovery email',
        text: `use the code provided and reset your password\n
        your code is ${code}`
    };
    let temp = "";
    db.select('*').from('login').where('email',email)
    .then(data => {console.log(data,data.length);return data})
    .then((user)=>{
        console.log(user.length,'here');
        if(user.length!=0){
            console.log('i am here')
            return true;
        }else {throw new Error("email doesn't exist")}}
    ).then(()=>db.select('*').from('passwordrecovery').where('email',email))
    .then((data=>{console.log(data,'hi');return data}))
    .then((user)=>{
        console.log(user.length,'hiii');
        if(user.length===0){
            db("passwordrecovery").insert({
                email:email,
                code:code
            })
            .catch(err=>console.log(err))
            .then(data =>{console.log(data);return true});
        }else{throw new Error('already exists')}})
        .then(()=>{
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    throw new Error('mail failure');
                } else {
                    console.log('Email sent: ' + info.response);
                    res.json('success').res(200);
                }
            }    
        )})    
        .catch(err=>{console.log(err);res.json('failure').status(400)});
    }

const handleChangePass = (req,res,db,bcrypt) =>{
    console.log('handleChangePass');
    console.log(req.body);
    const {email,code,password,password2}= req.body;
    if(email===""||code===""||password===""||password2===""||password!=password2){
        return res.json('failure').status(400)
    }
    const hash =bcrypt.hashSync(password);
    console.log(hash);
    db.select('*').from('passwordrecovery').where('email',email)
    .then(data=>{console.log(data);return data[0]})
    .then((user)=>{
        if(user.code===code){
        console.log('here');
        db.transaction(trx=>{
            trx('login').update({hash:hash}).transacting(trx)//.returning('*')
            // .then((data)=>console.log(data),(err)=>console.log(err))
            .then(()=>{return trx('passwordrecovery').where('email',email).del().transacting(trx)})
            .then(trx.commit)
            .then(()=>res.json('success').status(200))
            .catch(trx.rollback)
            
        }).then(data=>console.log(data),()=>res.json('retry').status(200))
    }else{res.json('failure').status(200)}
    }).catch((err)=>{console.log(err);res.json('failure').status(400)})
    .then(()=>{return true});

}

module.exports={
    handlePassRecReq:handlePassRecReq,
    handleChangePass:handleChangePass
}