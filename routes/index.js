
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: "Greg's App" });
};

exports.god = function(req, res){
  res.render('god', { title: "God Mode" });
};
