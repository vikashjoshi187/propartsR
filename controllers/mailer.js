import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user : "visverma966@gmail.com",
            pass : "toagxvzxqbbwdkzo"
        }
    });
   
