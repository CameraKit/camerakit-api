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

    var error = await this.contactService.sendEmail(body);

    if (error) {
      return res.status(HttpStatus.FORBIDDEN).send(JSON.stringify({ message: 'Error sending the email' }));
    }
    return res.status(HttpStatus.OK).send(JSON.stringify({ message: 'Success' }));
  }
}