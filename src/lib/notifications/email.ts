import nodemailer from 'nodemailer'
import { config } from '../../config'
import { NotificationType } from '../../types/notification'

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.port === 465,
  auth: {
    user: config.email.user,
    pass: config.email.pass
  }
})

const templates = {
  review: (data: any) => ({
    subject: 'New Review Received',
    html: `
      <h1>New Review</h1>
      <p>A new ${data.rating}-star review has been received for ${data.locationName}.</p>
      <p>${data.text}</p>
      <a href="${config.frontend.url}/reviews">View Review</a>
    `
  }),
  rank_change: (data: any) => ({
    subject: 'Ranking Change Alert',
    html: `
      <h1>Ranking Update</h1>
      <p>Your ranking for "${data.keyword}" has changed from ${data.oldRank} to ${data.newRank}.</p>
      <a href="${config.frontend.url}/keywords">View Details</a>
    `
  }),
  post_approval: (data: any) => ({
    subject: 'Post Requires Approval',
    html: `
      <h1>Post Approval Required</h1>
      <p>A new post requires your approval for ${data.locationName}.</p>
      <a href="${config.frontend.url}/posts">Review Post</a>
    `
  }),
  team_invite: (data: any) => ({
    subject: 'Team Invitation',
    html: `
      <h1>You've Been Invited</h1>
      <p>You've been invited to join the team for ${data.locationName}.</p>
      <a href="${data.inviteUrl}">Accept Invitation</a>
    `
  }),
  report_ready: (data: any) => ({
    subject: 'Report Ready',
    html: `
      <h1>Your Report is Ready</h1>
      <p>The ${data.reportName} report has been generated.</p>
      <a href="${config.frontend.url}/reports/${data.reportId}">View Report</a>
    `
  }),
  subscription: (data: any) => ({
    subject: 'Subscription Update',
    html: `
      <h1>Subscription Update</h1>
      <p>${data.message}</p>
      <a href="${config.frontend.url}/billing">View Billing Details</a>
    `
  })
}

export async function sendNotificationEmail(
  to: string,
  type: NotificationType,
  data: any
) {
  const template = templates[type](data)
  
  await transporter.sendMail({
    from: config.email.from,
    to,
    subject: template.subject,
    html: template.html
  })
}