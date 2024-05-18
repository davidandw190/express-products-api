import mongoose, { mongo } from 'mongoose';

import { MongoMemoryServer } from "mongodb-memory-server";
import { TokenKey } from '../enums/token-key.enum';
import { createProduct } from '../service/product.service';
import { createServer } from '../utils/server.utils';
import { signToken } from '../utils/jwt.utils';
import supertest from 'supertest';

const app = createServer();
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

const userPayload: { 
  _id: string;
   email: string; name: string; 
} = {
  _id: new mongoose.Types.ObjectId().toString(),
  email: "jane.doe@example.com",
  name: "Jane Doe",
}

const productPayload: {
  user: string;
  title: string;
  description: string;
  price: number;
  image: string;
} = {
  user: userPayload._id,
  title: "Canon EOS 1500D DSLR Camera with 18-55mm Lens",
  description:
    "Designed for first-time DSLR owners who want impressive results straight out of the box, capture those magic moments no matter your level with the EOS 1500D. With easy to use automatic shooting modes, large 24.1 MP sensor, Canon Camera Connect app integration and built-in feature guide, EOS 1500D is always ready to go.",
  price: 879.99,
  image: "https://i.imgur.com/QlRphfQ.jpg",
}

const userId = new mongoose.Types.ObjectId().toString();

describe('Product API', () => {
  describe("GET /api/products/:productId", () => {
    describe("when the product does not exist", () => {
      it("should respond with status 404", async () => {
        const productId = "non-existent";
        const response = await supertest(app).get(`/api/products/${productId}`);

        expect(response.status).toBe(404);
      });
    });

    describe("when the product exists", () => {
      let product: any;

      beforeAll(async () => {
        product = await createProduct(productPayload);
      });

      it("should respond with status 200", async () => {
        const response = await supertest(app).get(`/api/products/${product._id}`);

        expect(response.status).toBe(200);
        expect(response.body.title).toBe(product.title);
      });
    });
  });

  describe("POST /api/products", () => {
    describe("when the user is not authenticated", () => {
      it("should respond with status 403", async () => {
        const response = await supertest(app).post("/api/products");

        expect(response.status).toBe(403);
      });
    });

    describe("when the user is authenticated", async () => {
      let jwt: string;

      beforeAll(() => {
        jwt = signToken(userPayload, TokenKey.AccessTokenPrivateKey);
      });

      it("should respond with status 200 and create the product", async () => {
        const response = await supertest(app)
          .post("/api/products")
          .set("Authorization", `Bearer ${jwt}`)
          .send(productPayload);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.objectContaining({
          __v: expect.any(Number),
          _id: expect.any(String),
          createdAt: expect.any(String),
          description: productPayload.description,
          image: productPayload.image,
          price: productPayload.price,
          productId: expect.any(String),
          title: productPayload.title,
          updatedAt: expect.any(String),
          user: expect.any(String),
        }));
      });
    });
  });
});
