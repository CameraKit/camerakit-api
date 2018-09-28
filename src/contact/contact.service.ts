import { Injectable, Inject } from '@nestjs/common';
import { Contact } from './contact.entity';

import * as nodemailer from 'nodemailer';
import * as Email from 'email-templates';
import * as aws from 'aws-sdk';
import * as path from 'path';

aws.config.loadFromPath(path.join(__dirname, '../../config.json'));

@Injectable()
export class ContactService {
  private transporter = nodemailer.createTransport({
    SES: new aws.SES({
      apiVersion: '2010-12-01'
    })
  });

  async sendConfirmationEmail(contact: Contact): Promise<string> {  
    var confirmationEmail = new Email({
      message: {
        from: 'noreply@camerakit.email',
        to: contact.email
      },
      send: true,
      preview: false,
      transport: this.transporter,
      views: {
        root: './static/emails/',
      },
      juice: true,
      juiceResources: {
        preserveImportant: true,
        webResources: {
          relativeTo: path.join(__dirname, '../../static')
        }
      }
    });

    var response;
    try {
      response = await confirmationEmail.send({
        template: 'ck-contact-confirmation',
      });
    } catch (error) {
      console.error(error);
    }
    return response;
  }

  async sendInternalEmail(contact: Contact): Promise<string> {  
    var internalEmail = new Email({
      message: {
        from: 'noreply@camerakit.email',
        to: 'noreply@camerakit.email'
      },
      send: true,
      preview: false,
      transport: this.transporter,
      template: 'ck-contact-internal',
      views: {
        root: './static/emails/',
      },
      juice: true,
      juiceResources: {
        preserveImportant: true,
        webResources: {
          relativeTo: path.join(__dirname, '../../static')
        }
      }
    });

    var response;
    try {
      response = await internalEmail.send({
        template: 'ck-contact-internal',
        locals: {
          name: contact.name,
          email: contact.email,
          company: contact.company,
          message: contact.message,
        }
      });
    } catch (error) {
      console.error(error);
    }
    return response;
  }
}