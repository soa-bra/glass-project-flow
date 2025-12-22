import { handlerRegistry } from './index';
import { logger } from '@/infra/logger';

// Generic Webhook Handler for External Integrations
handlerRegistry.register({
  eventName: 'CulturalImpactMeasured',
  version: 1,
  handler: async (payload, metadata) => {
    await sendWebhook('cultural-impact-webhook', {
      event: 'CulturalImpactMeasured',
      data: payload,
      metadata: {
        eventId: metadata.eventId,
        timestamp: metadata.timestamp,
        source: metadata.source,
      }
    });
  },
  options: {
    enabled: process.env.ENABLE_CULTURAL_WEBHOOKS === 'true',
    retries: 3,
    timeout: 15000,
  },
});

handlerRegistry.register({
  eventName: 'ProjectCreated',
  version: 1,
  handler: async (payload, metadata) => {
    await sendWebhook('project-management-webhook', {
      event: 'ProjectCreated',
      data: payload,
      metadata: {
        eventId: metadata.eventId,
        timestamp: metadata.timestamp,
        source: metadata.source,
      }
    });
  },
  options: {
    enabled: process.env.ENABLE_PROJECT_WEBHOOKS === 'true',
    retries: 2,
    timeout: 10000,
  },
});

handlerRegistry.register({
  eventName: 'ContractSigned',
  version: 1,
  handler: async (payload, metadata) => {
    await sendWebhook('legal-system-webhook', {
      event: 'ContractSigned',
      data: payload,
      metadata: {
        eventId: metadata.eventId,
        timestamp: metadata.timestamp,
        source: metadata.source,
      }
    });
  },
  options: {
    enabled: process.env.ENABLE_LEGAL_WEBHOOKS === 'true',
    retries: 3,
    timeout: 20000,
  },
});

// Webhook sender utility
async function sendWebhook(webhookType: string, data: any): Promise<void> {
  const webhookUrls = {
    'cultural-impact-webhook': process.env.CULTURAL_IMPACT_WEBHOOK_URL,
    'project-management-webhook': process.env.PROJECT_MANAGEMENT_WEBHOOK_URL,
    'legal-system-webhook': process.env.LEGAL_SYSTEM_WEBHOOK_URL,
  };

  const url = webhookUrls[webhookType as keyof typeof webhookUrls];
  
  if (!url) {
    logger.debug({
      msg: 'Webhook URL not configured',
      webhookType,
    });
    return;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Supra-Events/1.0',
        'X-Event-Source': 'supra-system',
        'Authorization': `Bearer ${process.env.WEBHOOK_SECRET}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.status} ${response.statusText}`);
    }

    logger.info({
      msg: 'Webhook sent successfully',
      webhookType,
      eventId: data.metadata.eventId,
      status: response.status,
    });

  } catch (error) {
    logger.error({
      msg: 'Webhook send failed',
      webhookType,
      eventId: data.metadata.eventId,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
}

// Slack Integration Handler (Example)
handlerRegistry.register({
  eventName: 'BudgetExceeded',
  version: 1,
  handler: async (payload, metadata) => {
    const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
    
    if (!slackWebhookUrl) {
      logger.debug({ msg: 'Slack webhook not configured' });
      return;
    }

    const message = {
      text: `🚨 تجاوز في الميزانية`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*تجاوز في الميزانية*\n` +
                  `المشروع: ${payload.project_id}\n` +
                  `المبلغ المخصص: ${payload.allocated_amount} ر.س\n` +
                  `المبلغ المصروف: ${payload.spent_amount} ر.س\n` +
                  `الفائض: ${payload.excess_amount} ر.س (${payload.excess_percentage}%)`
          }
        }
      ]
    };

    await sendWebhook('slack-notification', message);
  },
  options: {
    enabled: process.env.ENABLE_SLACK_NOTIFICATIONS === 'true',
    retries: 2,
    timeout: 5000,
  },
});