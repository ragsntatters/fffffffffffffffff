import request from 'supertest'
import app from '../../app'
import { generateToken } from '../../lib/jwt'
import { createUser } from '../factories/user.factory'

export class TestClient {
  private token?: string

  constructor(private app = app) {}

  async authenticateAs(role: 'admin' | 'user' = 'user') {
    const user = createUser({ role })
    this.token = generateToken({ userId: user.id, email: user.email })
    return user
  }

  async get(url: string) {
    const req = request(this.app).get(url)
    if (this.token) {
      req.set('Authorization', `Bearer ${this.token}`)
    }
    return req
  }

  async post(url: string, data?: any) {
    const req = request(this.app).post(url).send(data)
    if (this.token) {
      req.set('Authorization', `Bearer ${this.token}`)
    }
    return req
  }

  async put(url: string, data?: any) {
    const req = request(this.app).put(url).send(data)
    if (this.token) {
      req.set('Authorization', `Bearer ${this.token}`)
    }
    return req
  }

  async patch(url: string, data?: any) {
    const req = request(this.app).patch(url).send(data)
    if (this.token) {
      req.set('Authorization', `Bearer ${this.token}`)
    }
    return req
  }

  async delete(url: string) {
    const req = request(this.app).delete(url)
    if (this.token) {
      req.set('Authorization', `Bearer ${this.token}`)
    }
    return req
  }
}