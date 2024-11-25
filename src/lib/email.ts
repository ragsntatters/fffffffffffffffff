import nodemailer from 'nodemailer'
import { config } from '../config'

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  auth: {
    user: config.email.user,
    pass: config.email.pass
  }
})

export const sendVerificationEmail = async (to: string, token: string) => {
  const verificationUrl = `${config.frontend.url}/verify-email?token=${token}`

  await transporter.sendMail({
    from: 'Track and Boost <noreply@trackandboost.com>',
    to,
    subject: 'Verify your Track and Boost account',
    html: `
      <h1>Email Verification</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
    `
  })
}

export const sendPasswordResetEmail = async (to: string, token: string) => {
  const resetUrl = `${config.frontend.url}/reset-password?token=${token}`

  await transporter.sendMail({
    from: 'Track and Boost <noreply@trackandboost.com>',
    to,
    subject: 'Reset your Track and Boost password',
    html: `
      <h1>Password Reset</h1>
      <p>Please click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 1 hour.</p>
    `
  })
}