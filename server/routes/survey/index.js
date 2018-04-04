import mongoose from 'mongoose';

import surveyTemplate from '../../services/emailTemplates/surveyTemplates';
import Mailer from '../../services/Mailer';
import requireLogin from '../../middlewares/requireLogin';
import requireCredits from '../../middlewares/requireCredits';
import { mapRecipients } from './helpers';

const Survey = mongoose.model('surveys');

const initSurveyRoutes = (app) => {
  app.get('/api/surveys/thanks', (req, res) => {
    res.send('Thanks for voting!');
  });

  app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
    const { title, subject, body, recipients } = req.body;

    const survey = new Survey({
      title,
      subject,
      body,
      recipients: recipients.split(',').map((email) => ({ email })),
      _user: req.user.id,
      dateSent: Date.now()
    });

    const mailer = new Mailer(survey, surveyTemplate(survey));

    try {
      await mailer.send();
      await survey.save();
      req.user.credits -= 1;
      const user = await req.user.save();

      res.send(user);
    } catch (err) {
      res.status(422).send(err);
    }
  });
};

export default initSurveyRoutes;
