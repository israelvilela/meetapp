import { Op } from 'sequelize';
import { parseISO, startOfDay, endOfDay, format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Meeting from '../models/Meeting';
import User from '../models/User';
import File from '../models/File';
import Registration from '../models/Registration';

class ListMeetingController {
  async index(req, res) {
    const { page = 1, date } = req.query;
    const parsedDate = parseISO(date);

    const meetings = await Meeting.findAll({
      where: {
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      order: [['date', 'DESC']],
      attributes: ['id', 'title', 'description', 'location', 'date'],
      include: [
        {
          model: User,
          as: 'organizer',
          attributes: ['name', 'email'],
        },
        {
          model: File,
          as: 'file',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    if (meetings) {
      meetings.map(m => {
        m.formattedDate = format(m.date, "dd 'de' MMMM', às' H'h'", {
          locale: pt,
        });
      });
    }

    //Remove da lista os meetups que ele está inscrito

    const registrations = await Registration.findAll({
      attributes: ['meeting_id'],
      where: {user_id: req.userId}})

    const result =  meetings.filter(m => !registrations.find(r => r.meeting_id === m.id ))

    return res.json(result);
  }
}

export default new ListMeetingController();
