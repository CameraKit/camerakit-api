import { Injectable, Inject, Logger } from '@nestjs/common';
import { Contact } from './contact.entity';
import { ConfigService } from '../config/config.service';

import * as nodemailer from 'nodemailer';
import * as Email from 'email-templates';
import * as aws from 'aws-sdk';
import * as path from 'path';

@Injectable()
export class ContactService {
  private transporter = null;

  constructor(private readonly config: ConfigService) {
    aws.config.accessKeyId = this.config.awsSesAccessKey;
    aws.config.secretAccessKey = this.config.awsSesSecretAccessKey;
    aws.config.region = this.config.awsSesRegion;

    this.transporter = nodemailer.createTransport({
      SES: new aws.SES({
        apiVersion: '2010-12-01',
      }),
    });
  }

  async sendConfirmationEmail(contact: Contact): Promise<string> {
    let response;
    const confirmationEmail = new Email({
      message: {
        from: this.config.contactNoreplyEmail,
        to: contact.email,
      },
      preview: false,
      transport: this.transporter,
      views: {
        root: './static/emails/',
      },
      juice: true,
      juiceResources: {
        preserveImportant: true,
        webResources: {
          relativeTo: path.join(__dirname, '../../static'),
        },
      },
    });

    if (process.env.NODE_ENV === 'development') {
      Logger.log('Printing confirmation email', ContactService.name);
      confirmationEmail.render('../../static/emails/ck-contact-confirmation/text', {
        name: contact.name,
        email: contact.email,
        company: contact.company,
        message: contact.message,
      })
      .then(email => {
        Logger.log(email, ContactService.name);
      })
      .catch(error => {
        Logger.error(error, ContactService.name);
      });
    }

    try {
      Logger.log(`Sending confirmation email to: ${contact.email}`, ContactService.name);
      response = await confirmationEmail.send({
        template: 'ck-contact-confirmation',
        message: contact.message,
        locals: {
          message: contact.message,
        },
      });
    } catch (error) {
      Logger.error(error, ContactService.name);
    }
    return response;
  }

  async sendInternalEmail(contact: Contact): Promise<string> {
    let response;

    const internalEmail = new Email({
      message: {
        from: this.config.contactNoreplyEmail,
        to: this.config.contactInternalEmail,
      },
      preview: false,
      transport: this.transporter,
      views: {
        root: './static/emails/',
      },
      juice: true,
      juiceResources: {
        preserveImportant: true,
        webResources: {
          relativeTo: path.join(__dirname, '../../static'),
        },
      },
    });

    if (process.env.NODE_ENV === 'development') {
      Logger.log('Printing internal email', ContactService.name);
      internalEmail.render('../../static/emails/ck-contact-internal/text', {
        name: contact.name,
        email: contact.email,
        company: contact.company,
        message: contact.message,
      })
      .then(email => {
        Logger.log(email, ContactService.name);
      })
      .catch(error => {
        Logger.error(error, ContactService.name);
      });
    }

    try {
      Logger.log(`Sending internal email to: ${this.config.contactInternalEmail}`, ContactService.name);
      response = await internalEmail.send({
        template: 'ck-contact-internal',
        message: contact.message,
        locals: {
          name: contact.name,
          email: contact.email,
          company: contact.company,
          message: contact.message,
        },
      });
    } catch (error) {
      Logger.error(error, ContactService.name);
    }
    return response;
  }
}