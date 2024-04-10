import { FilterQuery, QueryOptions } from 'mongoose';
import { ProductData, ProductDocument, ProductModel } from '../model/product.model';
import { log } from '../utils/logger.utils';

/**
 * Creates a new product in the database.
 * @param data The data of the product to be created.
 * @returns A promise resolving to the created product document.
 */
export async function createProduct(data: ProductData): Promise<ProductDocument> {
  try {
    return await ProductModel.create(data);
  } catch (error) {
    log.error(error);
    throw new Error('Unable to create product');
  }
}

/**
 * Finds a product in the database based on the provided query.
 * @param query The query to filter products.
 * @param options Optional query options.
 * @returns A promise resolving to the found product document or null if not found.
 */
export async function findProduct(
  query: FilterQuery<ProductDocument>,
  options: QueryOptions = { lean: true },
): Promise<ProductDocument | null> {
  try {
    const product = await ProductModel.findOne(query, {}, options);

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  } catch (error) {
    log.error(error);
    throw new Error('Unable to find product');
  }
}


