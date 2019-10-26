import Mail from '../../lib/Mail';

class RegistrationMail {
  get key() {
    return 'RegistrationMail';
  }

  async handle({ data }) {
    const { register } = data;
    console.log('aquii', register)
    await Mail.sendMail({
      to: `${register.meetingRegistration.organizer.name}<${register.meetingRegistration.organizer.email}>`,
      subject: 'Nova Inscrição',
      template: 'registration',
      context: {
        organizer: register.meetingRegistration.organizer.name,
        title: register.meetingRegistration.title,
        user: register.userRegistration.name,
        email: register.userRegistration.email,
      },
    });
  }
}

export default new RegistrationMail();
