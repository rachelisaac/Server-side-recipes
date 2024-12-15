function pageNotFound (req, res, next){
    next({status:404, error: 'page not found!'})
}

function errorHandling(err, req, res, next) {
    res.status(err.status || 500)
        .json({ error: err.error || "server error!" });
}

export { errorHandling,pageNotFound };