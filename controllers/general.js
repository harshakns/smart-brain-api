function handleGeneral(req, res, db){
    console.log(req.headers);
    db.select('*').from('users')
        .then(data => { res.json(data).status(200) })
        .catch(() => res.json('connection problem').status(400))
}

module.exports={
    handleGeneral:handleGeneral
}