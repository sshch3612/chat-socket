'use strict';

const Controller = require('egg').Controller;

class ListController extends Controller {
  makelist(){
    const result = [];
    for(let i=0;i< 10;i++){
      result.push({key:`tetst${i}`})
    }
    return result;
  }

  async index() {
    this.ctx.body = 'indexindex';
  }
  async getList() {
    const { request, response, logger } = this.ctx;
    // logger.info(request, response, this);
    
    response.body = this.makelist();
  }
}

module.exports = ListController;
