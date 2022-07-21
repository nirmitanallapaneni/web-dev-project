function smail(email2, name) {
    const nodemailer = require('nodemailer');
    let mailOptions = {
        from: "nnirmita82@gmail.com",
        to: email2,
        subject: "Thanks for your Feedback",
        text: "Dear " + name + ", Thank you for your feedback! \n\nNirmita N \n https://mysterious-waters-08335.herokuapp.com/"
    };


    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "nnirmita82@gmail.com",
            pass: "lhhtdgqjaqrwshix"
        }
    })
        .sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error.message);
            }
            else {
                console.log('Email has been sent to user');
            }
        });
    return;
}
module.exports = { smail };