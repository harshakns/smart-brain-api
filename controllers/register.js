const handleRegister =(req,res,db,bcrypt)=>{
    const { user, password, email } = req.body;
    const hash = bcrypt.hashSync(password);
    console.log(user, password, email, hash);

    db.transaction(trx => {
        trx.insert({
            name: user,
            email: email,
            entries: 0,
            joined: new Date()
        }).into('users')
            .transacting(trx)
            .then(() => {
                return trx.insert({
                    email: email,
                    hash: hash
                }).into('login')
                    .transacting(trx)
                    .then((data) => {
                        res.json('success').status(200);
                        return data
                    })

            })
            .then(trx.commit)
            .catch(trx.rollback)

    }).catch(err => res.json('network error').status(400))

}

module.exports ={
    handleRegister:handleRegister
}