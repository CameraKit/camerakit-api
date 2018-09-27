import { Injectable, Inject } from '@nestjs/common';
import { Contact } from './contact.entity';

import * as nodemailer from 'nodemailer';
import * as Email from 'email-templates';

@Injectable()
export class ContactService {
  private transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  private email = new Email({
    message: {
      from: process.env.EMAIL_ADDRESS
    },
    send: true,
    preview: false,
    transport: this.transporter,
    views: {
      root: './static/emails/',
    }
  });

  async sendEmail(contact: Contact): Promise<string> {  
    var response;
    try {
      response = await this.email.send({
        template: 'ck-contact',
        message: {
          to: process.env.EMAIL_RECIEVER
        },
        locals: {
          name: contact.name,
          company: contact.company,
          email: contact.email,
          message: contact.message,
        }
      });
    } catch (error) {
      console.error(error);
    }
    return response;
  }
}