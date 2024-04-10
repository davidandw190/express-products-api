import { FilterQuery, QueryOptions, UpdateQuery, UpdateWriteOpResult } from 'mongoose';
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

/**
 * Retrieves a list of products based on the provided query.
 * @param query The query to filter products.
 * @param options Optional query options.
 * @returns A promise resolving to an array of product documents.
 */
export async function listProducts(
  query: FilterQuery<ProductDocument>,
  options: QueryOptions = { lean: true },
): Promise<ProductDocument[]> {
  try {
    return await ProductModel.find(query, {}, options);
  } catch (error) {
    log.error(error);
    throw new Error('Unable to retrieve products');
  }
}

/**
 * Updates a product in the database based on the provided query and update data.
 * @param query The query to filter products.
 * @param data The update data for the product.
 * @returns A promise resolving to the update result.
 */
export async function updateProduct(
  query: FilterQuery<ProductDocument>,
  update: UpdateQuery<ProductDocument>
): Promise<UpdateWriteOpResult> {
  try {
    return await ProductModel.updateOne(query, update);
  } catch (error) {
    log.error(error);
    throw new Error('Unable to update product');
  }
}

/**
 * Deletes a product from the database based on the provided query.
 * @param query The query to filter products for deletion.
 * @returns A promise resolving to a boolean indicating if the deletion was successful.
 * @throws Error if there's an error deleting the product.
 */
export async function deleteProduct(query: FilterQuery<ProductDocument>): Promise<boolean> {
  try {
    const result = await ProductModel.deleteOne(query);
    return result.deletedCount !== undefined && result.deletedCount > 0;
  } catch (error) {
    console.error(error);
    throw new Error('Unable to delete product');
  }
}

