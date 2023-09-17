exports.getOverview = (req, res) => {
  res.status(200).render('overview', {
    title: ' hello world',
  });
};

exports.getTour = (req, res) => {
  res.status(200).render('tour', {
    title: ' The Forest Hiker',
  });
};
