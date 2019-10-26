import { Op } from 'sequelize';
import { parseISO, startOfDay, endOfDay, format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Meeting from '../models/Meeting';
import User from '../models/User';
import File from '../models/File';

class ListMeetingController {
  async index(req, res) {
    const { page = 1, date } = req.query;

    const parsedDate = parseISO(date);

    const meetings = await Meeting.findAll({
      where: {
        user_id: req.userId,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      order: ['date'],
      attributes: ['id', 'title', 'description', 'location', 'date'],
      limit: 10,
      offset: (page - 1) * 10,
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

    return res.json(meetings);
  }
}

export default new ListMeetingController();
