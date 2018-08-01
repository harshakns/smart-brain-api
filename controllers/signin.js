
const handleSignin=(req,res,db,bcrypt)=>{
    const { email, password } = req.body;
    console.log(email, password)
    db.select('*').from('login').where('email', email)
        .then(data => {
            console.log(data[0]);
            bcrypt.compareSync(password, data[0].hash)
                ? db.select('*').from('users').where('email', email)
                    .then(data => Object.assign({ received: 'success' }, data[0]))
                    .then(user => res.json(user).status(400))
                : res.json('username or password incorrect').status(400);
        })
        .catch(err => res.json('username or password incorrect').status(400));

}

module.exports = {
    handleSignin:handleSignin
}