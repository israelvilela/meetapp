import * as Yup from 'yup';
import { Op } from 'sequelize';
import { isAfter, isEqual } from 'date-fns';
import Registration from '../models/Registration';
import Meeting from '../models/Meeting';

class RegistrationController {
  async index(req, res) {
    const registrations = await Registration.findAll({
      where: {
        user_id: req.userId,
      },
      order: [[{ model: Meeting, as: 'meetingRegistration' }, 'date', 'ASC']],
      include: [
        {
          model: Meeting,
          as: 'meetingRegistration',
          attributes: ['title', 'description', 'location', 'date'],
          where: { date: { [Op.gte]: new Date() } },
        },
      ],
    });

    return res.json(registrations);
  }

  async store(req, res) {
    const { meetingId } = req.body;

    const schema = Yup.object().shape({
      meetingId: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ message: 'Validation fails. ' });
    }

    // Valida se meetup existe
    const meetup = await Meeting.findByPk(meetingId);
    if (!meetup) {
      return res.status(400).json({ message: 'Meetup inexistente.' });
    }

    // Valida se meetup já aconteceu
    if (isAfter(new Date(), meetup.date)) {
      return res.status(400).json({ message: 'Meetup já foi realizado.' });
    }

    // Valida se já está inscrito no meetup
    const listRegistration = await Registration.findAll({
      where: {
        user_id: req.userId,
      },
      include: [
        {
          model: Meeting,
          as: 'meetingRegistration',
          attributes: ['id', 'date'],
        },
      ],
    });

    const hasRegistration = listRegistration.find(
      l => l.meetingRegistration.id === meetingId
    );

    if (hasRegistration) {
      return res
        .status(400)
        .json({ message: 'Inscrição já realizada no meetup selecionado. ' });
    }

    // Valida se está inscrito em outro meetup no mesmo horário
    const result = listRegistration.filter(l =>
      isEqual(l.meetingRegistration.date, meetup.date)
    );

    if (result.length && result.length > 0) {
      return res.status(400).json({
        message: 'Você já está cadastrado em outro meetup no mesmo horário. ',
      });
    }

    const registration = await Registration.create({
      user_id: req.userId,
      meeting_id: meetingId,
    });

    return res.json(registration);
  }
}

export default new RegistrationController();