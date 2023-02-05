const ProductService = require('../services/product-service');

// customer 서비스는 product 서비스와 분리되었기 때문에 제거.
// const CustomerService = require('../services/customer-service');

// 대신 publisher 임포트
const { PublishCustomerEvent, PublishShoppingEvent } = require('../utils');

const UserAuth = require('./middlewares/auth');

module.exports = (app) => {
  const service = new ProductService();
  //   const customerService = new CustomerService();

  app.post('/product/create', async (req, res, next) => {
    try {
      const { name, desc, type, unit, price, available, suplier, banner } =
        req.body;
      // validation
      const { data } = await service.CreateProduct({
        name,
        desc,
        type,
        unit,
        price,
        available,
        suplier,
        banner,
      });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get('/category/:type', async (req, res, next) => {
    const type = req.params.type;

    try {
      const { data } = await service.GetProductsByCategory(type);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get('/:id', async (req, res, next) => {
    const productId = req.params.id;

    try {
      const { data } = await service.GetProductDescription(productId);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.post('/ids', async (req, res, next) => {
    try {
      const { ids } = req.body;
      const products = await service.GetSelectedProducts(ids);
      return res.status(200).json(products);
    } catch (err) {
      next(err);
    }
  });

  app.put('/wishlist', UserAuth, async (req, res, next) => {
    const { _id } = req.user;

    // payload를 얻은 뒤 // customer service로 보내기
    const { data } = await service.GetProductPayload(
      _id,
      { productId: req.body._id },
      'ADD_TO_WISHLIST'
    );

    try {
      // customerService에 위시리스트 등록 요청하는 다른 방법을 사용
      //   const product = await service.GetProductById(req.body._id);
      //   const wishList = await customerService.AddToWishlist(_id, product);

      PublishCustomerEvent(data);

      return res.status(200).json(data.data.product);
    } catch (err) {}
  });

  app.delete('/wishlist/:id', UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    const productId = req.params.id;

    try {
      const { data } = await service.GetProductPayload(
        _id,
        { productId },
        'REMOVE_FROM_WISHLIST'
      );

      //   const product = await service.GetProductById(productId);
      //   const wishlist = await customerService.AddToWishlist(_id, product);

      PublishCustomerEvent(data);
      return res.status(200).json(data.data.product);
    } catch (err) {
      next(err);
    }
  });

  app.put('/cart', UserAuth, async (req, res, next) => {
    const { _id } = req.user;

    try {
      const { data } = await service.GetProductPayload(
        _id,
        { productId: req.body._id, qty: req.body.qty },
        'ADD_TO_CART'
      );

      //   const product = await service.GetProductById(_id);

      //   const result = await customerService.ManageCart(
      //     req.user._id,
      //     product,
      //     qty,
      //     false
      //   );
      console.log(`🐞🐞🐞🐞 data: ${JSON.stringify(data)}`);

      PublishCustomerEvent(data);
      PublishShoppingEvent(data);

      const response = {
        product: data.data.product,
        unit: data.data.qty,
      };

      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  });

  app.delete('/cart/:id', UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    const productId = req.params.id;

    try {
      const { data } = await service.GetProductPayload(
        _id,
        { productId: req.body._id, qty: req.body.qty },
        'REMOVE_FROM_CART'
      );

      PublishCustomerEvent(data);
      PublishShoppingEvent(data);

      //   const product = await service.GetProductById(req.params.id);
      //   const result = await customerService.ManageCart(_id, product, 0, true);

      const response = {
        product: data.data.product,
        unit: data.data.qty,
      };

      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  });

  //get Top products and category
  app.get('/', async (req, res, next) => {
    //check validation
    try {
      const { data } = await service.GetProducts();
      return res.status(200).json(data);
    } catch (error) {
      next(err);
    }
  });
};
