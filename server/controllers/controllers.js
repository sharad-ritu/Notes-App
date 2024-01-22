//get HomePage
exports.homePage = async(req, res) => {
    const locals = {
        title: 'Notes App',
        description: 'NodeJs Notes App'
    }

    res.render('index', {
        locals,
        layout: './layouts/front-page.ejs'
    });
};

exports.aboutPage = async(req, res) => {
    const locals = {
        title: 'About',
        description: 'Notes App about page'
    }
    
    res.render('about', locals);
};