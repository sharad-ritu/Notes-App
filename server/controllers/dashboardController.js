//get dashboard
exports.dashboard = async(req, res) => {
    const locals = {
        title: 'Dashboard',
        description: 'NodeJs Notes App'
    }

    res.render('dashboard/index', {
        locals,
        layout: './layouts/dashboard'
    });
};