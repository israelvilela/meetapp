import * as Yup from 'yup';
import { startOfHour, parseISO, parse, isAfter, isBefore, format, subHours } from 'date-fns';
import Meeting from '../models/Meeting';

class MeetingController {

  async index(req, res) {}

  async store(req, res) {
    const { title, description, location, date, file_id } = req.body;

    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
      file_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ message: 'Validation fails. ' });
    }

    // Validar se data é anterior a atual
    if (isBefore(parseISO(date), new Date())) {
      return res.status(400).json({ message: 'Não é possível agendar com uma data passada. ' });
    }

    const meeting = await Meeting.create({
      title,
      description,
      location,
      user_id: req.userId,
      file_id,
      date
    });

    return res.json(meeting);
  }

  async update(req, res) {
    const { id, date } = req.body;

    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
      file_id: Yup.number().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ message: 'Validation fails. ' });
    }

    // Valida se data da reunião já passou
    const meeting = await Meeting.findByPk(id);

    if (isAfter(new Date(), meeting.date)) {
      return res.status(400).json({ message: 'Não é possível alterar uma reunião já realizada. ' });
    }

    // Valida se data informada é menor que a atual
    if (isBefore(parseISO(date), new Date())) {
      return res.status(400).json({ message: 'Não é possível alterar para uma data passada. ' });
    }

    // Validar se usuário é o organizador
    if (meeting.user_id !== req.userId) {
      return res.status(400).json({ message: 'Você não tem permissão para alterar a reunião onde não é organizador.' });
    }

    const { title, description, location } = await Meeting.update(req.body, {
      where: { id: req.body.id }
    });

    return res.json({
      title,
      description,
      location,
      date
    });

  }

  async delete(req, res) {}
}

export default new MeetingController();
