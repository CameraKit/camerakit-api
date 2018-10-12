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

  constructor(config: ConfigService) {
    aws.config.accessKeyId = config.awsSesAccessKey;
    aws.config.secretAccessKey = config.awsSesSecretAccessKey;
    aws.config.region = config.awsSesRegion;

    this.transporter = nodemailer.createTransport({
      SES: new aws.SES({
        apiVersion: '2010-12-01'
      })
    });
  }

  async sendConfirmationEmail(contact: Contact): Promise<string> {
    const confirmationEmail = new Email({
      message: {
        from: 'noreply@camerakit.email',
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
      Logger.log('Sending confirmation email', ContactService.name);
      confirmationEmail.render('../../static/emails/ck-contact-confirmation/text', {
        name: contact.name,
        email: contact.email,
        company: contact.company,
        message: contact.message,
      })
      .then(Logger.log)
      .catch(Logger.error);
    }

    let response;
    try {
      response = await confirmationEmail.send({
        template: 'ck-contact-confirmation',
        locals: {
          message: contact.message,
        },
      });
    } catch (error) {
      Logger.error(error);
    }
    return response;
  }

  async sendInternalEmail(contact: Contact): Promise<string> {
    const internalEmail = new Email({
      message: {
        from: 'noreply@camerakit.email',
        to: 'noreply@camerakit.email',
      },
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
          relativeTo: path.join(__dirname, '../../static'),
        },
      },
    });

    if (process.env.NODE_ENV === 'development') {
      Logger.log('Sending internal email', ContactService.name);
      internalEmail.render('../../static/emails/ck-contact-internal/text', {
        name: contact.name,
        email: contact.email,
        company: contact.company,
        message: contact.message,
      })
      .then(Logger.log)
      .catch(Logger.error);
    }

    let response;
    try {
      response = await internalEmail.send({
        template: 'ck-contact-internal',
        locals: {
          name: contact.name,
          email: contact.email,
          company: contact.company,
          message: contact.message,
        },
      });
    } catch (error) {
      Logger.error(error);
    }
    return response;
  }
}