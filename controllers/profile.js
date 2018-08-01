const handleProfile = (req, res, db)=>{
    console.log(req.params);
    const { id } = req.params;
    db.select('*').from('users').where('id', id)
        .then(data => {
            if (data.length != 0) { res.json(data[0]).status(200) }
            else { res.json('no matching user').status(400) }
        })
        .catch(err => res.json('unable to connect').status('404'));
}

module.exports = {
    handleProfile:handleProfile
}