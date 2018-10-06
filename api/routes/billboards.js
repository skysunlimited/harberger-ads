const _ = require('lodash');
const { Models } = require('../models');

const { loggedInOnly } = require('../lib/auth-helpers');

const { validate } = require('../lib/validation-helpers');

module.exports = function initRoutes(router) {
  router.get('/billboards', async (ctx, next) => {
    const billboards = await Models.Billboard.findAll();
    const ads = await Models.Ad.findAll({
      where: { id: _.map(billboards, 'activeAdId') },
    });
    const adsByid = _.keyBy(ads, 'id');
    _.each(billboards, (b) => { b.refs.activeAd = adsByid[b.activeAdId]; });
    ctx.body = billboards;
  });

  router.param('billboardId', async (adId, ctx, next) => {
    ctx.$.billboard = await Models.Billboard.findById(adId);
    if (!ctx.$.billboard) ctx.throw('NotFound', 'Ad does not exist');

    if (!ctx.$.superadmin && ctx.$.billboard.advertiserUserId !== ctx.$.authUser.id) {
      ctx.throw('Forbidden', 'This ad is not yours');
    }

    ctx.$.ad = ctx.$.billboard.refs.activeAd;


    console.log(ctx.$.ad.refs.user.dataValues);
    next();
  });
};