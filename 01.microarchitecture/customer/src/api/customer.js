const CustomerService = require('../services/customer-service');
const UserAuth = require('./middlewares/auth');

module.exports = (app) => {
  const service = new CustomerService();

  // 회원가입
  // /customer/signup 이지만 gateway 통해서 오기 때문에 /signup
  app.post('/signup', async (req, res, next) => {
    try {
      const { email, password, phone } = req.body;
      // 회원가입 후 id와 토큰을 반환
      const { data } = await service.SignUp({ email, password, phone });
      return res.json(data);
    } catch (err) {
      // 에러 발생 시 전역 에러 핸들러로 토스
      next(err);
    }
  });

  // 로그인
  app.post('/login', async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const { data } = await service.SignIn({ email, password });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.post('/address', UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;

      const { street, postalCode, city, country } = req.body;

      const { data } = await service.AddNewAddress(_id, {
        street,
        postalCode,
        city,
        country,
      });

      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get('/profile', UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const { data } = await service.GetProfile({ _id });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get('/shoping-details', UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const { data } = await service.GetShopingDetails(_id);

      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get('/wishlist', UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const { data } = await service.GetWishList(_id);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });
};
