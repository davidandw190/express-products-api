import { CreateProductData, UpdateProductData } from '../schema/product.schema';
import { Request, Response } from 'express';
import { createProduct, findProduct, updateProduct } from '../service/product.service';

export async function createProductHandler(req: Request<{}, {}, CreateProductData['body']>, res: Response) {
  const userId = res.locals.user._id;

  const body = req.body;

  const product = await createProduct({ ...body, user: userId });

  return res.send(product);
}

export async function updateProductHandler(req: Request<UpdateProductData['params']>, res: Response) {
  const userId = res.locals.user._id;

  const productId = req.params.productId;
  const update = req.body;

  const product = await findProduct({ productId });

  if (!product) {
    return res.sendStatus(404);
  }

  if (String(product.user) !== userId) {
    return res.sendStatus(403);
  }

  const updatedProduct = await updateProduct({ productId }, update, {
    new: true,
  });

  return res.send(updatedProduct);
}
