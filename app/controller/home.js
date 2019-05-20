'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    this.ctx.body = 'indexindex';
  }
  async getUsers() {
    const { request, response, logger } = this.ctx;
    // logger.info(request, response, this);
    const result = await this.ctx.service.user.getUsers();
    logger.info(request, response, result);
    // this.ctx.logger.info(this.ctx);
    response.body = result;
    return response.body;
  }

  async createUsers() {
    const { request, response } = this.ctx;
    const { username, phone, wxNumber } = request.body;
    const result = await this.ctx.service.user.createUsers(username, phone, wxNumber);
    response.body = result;
  }

}

module.exports = HomeController;
