const Clarifai = require('clarifai');

const handleUrl = (req,res) =>{
    const Model = new Clarifai.App({
        apiKey: 'cf4a5ed9d74840afa4539b98b474e08b'
    });
    console.log(req.body);
    const {link} = req.body;
    Model.models.predict('a403429f2ddf4b49b307e318f00e528b',link)
    .then(data => {console.log(data);return data})
    .catch(()=>res.json('network error').status(400))
    // response.json())
    // .catch(()=>res.json('network error').status(400))
    .then(response => res.json(response).status(200))
}


const handleImage = (req, res, db)=>{
    console.log(req.body);
    const { id } = req.body;
    db.select('*').from('users').where('id', id)
        .then(data => {
            if (data.length != 0) {
                const t = Number(data[0].entries) + 1;
                console.log(t);
                db.select('*').from('users').where('id', id).update({ 'entries': t })
                    .then(res.json(t).status(200))
            } else { res.json('user not found').status(400) }
        }).catch(err => res.json('network error').status(400));
}

module.exports={
    handleUrl:handleUrl,
    handleImage:handleImage
}