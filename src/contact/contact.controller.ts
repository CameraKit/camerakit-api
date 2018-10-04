import { Controller, Res, Post, Body, Param, HttpStatus, Logger } from '@nestjs/common';
import { ContactService } from './contact.service';
import { Contact } from './contact.entity';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) { }

  @Post('')
  async sendEmail(@Res() res: any, @Body() body: Contact) {
    if (!(body && body.name && body.email && body.company && body.message)) {
      Logger.error('POST sendEmail: incomplete request.', undefined, ContactController.name);
      return res.status(HttpStatus.FORBIDDEN).send(JSON.stringify({ message: 'Name, Email, Company and Message are required!' }));
    }

    var confirmationResponse = await this.contactService.sendConfirmationEmail(body);
    var internalResponse = await this.contactService.sendInternalEmail(body);

    if (typeof confirmationResponse === 'undefined' || typeof internalResponse === 'undefined') {
      Logger.error('POST sendEmail: Email send error.', undefined, ContactController.name);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(JSON.stringify({ message: 'Error sending the email' }));
    }
    else {
      Logger.log(`Sent email for ${body.email}.`, ContactController.name);
      res.status(HttpStatus.OK).send(JSON.stringify({ message: 'Success' }));
    }
  }
}