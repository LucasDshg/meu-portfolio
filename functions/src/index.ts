import * as admin from 'firebase-admin';
import { onRequest } from 'firebase-functions/https';
import * as logger from 'firebase-functions/logger';
import Stripe from 'stripe';

if (admin.apps.length === 0) {
  admin.initializeApp();
}

export const stripeWebhook = onRequest(
  {
    region: 'southamerica-east1',
    secrets: ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'],
  },
  async (req, res) => {
    if (req.method !== 'POST') {
      res.status(405).send('Method Not Allowed');
      return;
    }

    // eslint-disable-next-line no-undef
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

    const sig = req.get('stripe-signature') as string;
    // eslint-disable-next-line no-undef
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

    let eventStripe: any;

    try {
      // É CRUCIAL usar o req.rawBody para validar a assinatura do Stripe
      // eslint-disable-next-line prefer-const
      eventStripe = stripe.webhooks.constructEvent(
        req.rawBody,
        sig,
        endpointSecret,
      );
    } catch (err: any) {
      logger.error(`❌ Erro na assinatura do Webhook: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    if (eventStripe.type === 'checkout.session.completed') {
      const session = eventStripe.data.object;

      const userSlug = session.client_reference_id;

      if (!userSlug) {
        logger.error('⚠️ client_reference_id (slug) não encontrado na sessão.');
        res.status(400).send('Missing client_reference_id');
        return;
      }

      try {
        const db = admin.firestore();
        const usersRef = db.collection('users');
        const querySnapshot = await usersRef
          .where('slug', '==', userSlug)
          .get();

        if (querySnapshot.empty) {
          logger.error(`❌ Usuário com slug ${userSlug} não encontrado.`);
          res.status(404).send('User not found');
          return;
        }

        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

        const userDoc = querySnapshot.docs[0];
        await userDoc.ref.update({
          adFreeUntil: admin.firestore.Timestamp.fromDate(oneYearFromNow),
          stripeSessionId: session.id,
        });

        logger.log(`✅ Plano Pro ativado com sucesso para: ${userSlug}`);
      } catch (error) {
        logger.error('❌ Erro ao atualizar o Firestore:', error);
        res.status(500).send('Internal Server Error');
        return;
      }
    }

    res.status(200).json({ received: true });
  },
);
