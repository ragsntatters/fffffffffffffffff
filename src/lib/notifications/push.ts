import webpush from 'web-push'
import { config } from '../../config'
import { NotificationType } from '../../types/notification'

webpush.setVapidDetails(
  `mailto:${config.email.from}`,
  config.push.publicKey,
  config.push.privateKey
)

const templates = {
  review: (data: any) => ({
    title: 'New Review',
    body: `${data.rating}-star review received for ${data.locationName}`,
    icon: '/icons/review.png',
    data: {
      url: '/reviews'
    }
  }),
  rank_change: (data: any) => ({
    title: 'Ranking Update',
    body: `Ranking changed from ${data.oldRank} to ${data.newRank} for "${data.keyword}"`,
    icon: '/icons/rank.png',
    data: {
      url: '/keywords'
    }
  }),
  post_approval: (data: any) => ({
    title: 'Post Approval Required',
    body: `New post needs approval for ${data.locationName}`,
    icon: '/icons/post.png',
    data: {
      url: '/posts'
    }
  }),
  team_invite: (data: any) => ({
    title: 'Team Invitation',
    body: `You've been invited to join ${data.locationName}`,
    icon: '/icons/team.png',
    data: {
      url: data.inviteUrl
    }
  }),
  report_ready: (data: any) => ({
    title: 'Report Ready',
    body: `${data.reportName} report has been generated`,
    icon: '/icons/report.png',
    data: {
      url: `/reports/${data.reportId}`
    }
  }),
  subscription: (data: any) => ({
    title: 'Subscription Update',
    body: data.message,
    icon: '/icons/billing.png',
    data: {
      url: '/billing'
    }
  })
}

export async function sendPushNotification(
  subscription: webpush.PushSubscription,
  type: NotificationType,
  data: any
) {
  const template = templates[type](data)
  
  await webpush.sendNotification(
    subscription,
    JSON.stringify(template)
  )
}