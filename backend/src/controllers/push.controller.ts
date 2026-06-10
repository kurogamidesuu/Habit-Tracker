import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { messaging } from "../lib/firebase";

export const saveSubscription = async (req: Request, res: Response) => {
  const { subscription, timezone } = req.body;

  try {
    await prisma.pushSubscription.upsert({
      where: {
        userId: req.user.id
      },
      update: {
        subscription: JSON.stringify(subscription),
        timezone,
      },
      create: {
        userId: req.user.id,
        subscription: JSON.stringify(subscription),
        timezone,
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Subscription saved',
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: 'Failed to save subscription',
    });
  }
}

export const sendTestNotification = async (req: Request, res: Response) => {
  try {
    const sub = await prisma.pushSubscription.findUnique({
      where: {
        userId: req.user.id,
      }
    });

    if (!sub) {
      return res.status(404).json({
        success: false,
        message: 'No subscription found',
      });
    }

    const subscription = JSON.parse(sub.subscription);

    await messaging.send({
      token: subscription.fcmToken,
      data: {
        title: 'Kintsugi',
        body: 'Test notification working!',
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Notification sent',
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: 'Failed to send notification',
    });
  }
}