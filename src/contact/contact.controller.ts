import { Controller, Res, Post, Body, Param, HttpStatus } from '@nestjs/common';
import { ContactService } from './contact.service';
import { Contact } from './contact.entity';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) { }

  @Post('')
  async sendEmail(@Res() res: any, @Body() body: Contact) {
    if (!(body && body.name && body.email && body.company && body.message)) {
      return res.status(HttpStatus.FORBIDDEN).send(JSON.stringify({ message: 'Name, Email, Company and Message are required!' }));
    }

    var response = await this.contactService.sendEmail(body);

    if (typeof response === 'undefined') {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(JSON.stringify({ message: 'Error sending the email' }));
    }
    else {
      res.status(HttpStatus.OK).send(JSON.stringify({ message: 'Success' }));
    }
  }
}