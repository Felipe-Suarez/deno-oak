import { Context, helpers } from "../../deps.ts";
import logger from "../middlewares/logger.ts";
import { Product } from "../types/products.types.ts";

const DB_PRODUCTS: Product[] = [];
DB_PRODUCTS.push({ uuid: "1", name: "Pepe", description: "Producto numero 1", price: 1000 });
DB_PRODUCTS.push({ uuid: "2", name: "Felipe", description: "Producto numero 2", price: 2000 });
DB_PRODUCTS.push({ uuid: "3", name: "Diego", description: "Producto numero 3", price: 3000 });
DB_PRODUCTS.push({ uuid: "4", name: "Manuel", description: "Producto numero 4", price: 4000 });

export const findAll = async (ctx: Context) => {
  try {
    ctx.response.status = 200;
    logger.debug(`status: ${ctx.response.status} method: findAll handler`);
    ctx.response.body = await { code: "00", data: DB_PRODUCTS };
  } catch (error) {
    ctx.response.status = 500;
    logger.error(`status: ${ctx.response.status} ${error}`);
    ctx.response.body = { code: "99", msg: error };
  }
};

export const findProduct = async (ctx: Context) => {
  try {
    const { userId } = helpers.getQuery(ctx, { mergeParams: true });
    const product = await DB_PRODUCTS.find((p) => p.uuid == userId);
    if (product) {
      ctx.response.body = await { code: "00", data: product };
    } else {
      ctx.response.body = await { code: "01", msg: `Usuario con id ${userId} no encontrado.` };
    }
  } catch (error) {
    ctx.response.status = 500;
    logger.error(`status: ${ctx.response.status} ${error}`);
    ctx.response.body = { code: "99", msg: error };
  }
};

export const createProduct = async (ctx: Context) => {
  try {
    ctx.response.status = 201;
    logger.debug(`status: ${ctx.response.status} method: createProduct handler`);
    const { name, description, price } = await ctx.request.body().value;
    const newId = Number(DB_PRODUCTS[DB_PRODUCTS.length - 1].uuid) + 1;
    const product: Product = {
      uuid: newId.toString(),
      name: name,
      description: description,
      price: price,
    };
    DB_PRODUCTS.push(product);
    ctx.response.body = await { code: "00", data: product };
  } catch (error) {
    ctx.response.status = 500;
    logger.error(`status: ${ctx.response.status} ${error}`);
    ctx.response.body = { code: "99", msg: error };
  }
};

export const updateProduct = async (ctx: Context) => {
  try {
    ctx.response.status = 202;
    logger.debug(`status: ${ctx.response.status} method: updateProduct handler`);
    const { userId } = helpers.getQuery(ctx, { mergeParams: true });
    const productIndex = await DB_PRODUCTS.findIndex((p) => p.uuid == userId);
    if (productIndex !== -1) {
      const { name, description, price } = await ctx.request.body().value;
      const oldProduct = DB_PRODUCTS[productIndex];
      const product: Product = {
        uuid: userId,
        name: name || oldProduct.name,
        description: description || oldProduct.description,
        price: price || oldProduct.price,
      };
      DB_PRODUCTS.splice(productIndex, 1, product);
      ctx.response.body = { code: "00", data: { uuid: userId, name, description, price } };
    } else {
      ctx.response.body = { code: "01", msg: `Usuario con id ${userId} no encontrado.` };
    }
  } catch (error) {
    ctx.response.status = 500;
    logger.error(`status: ${ctx.response.status} ${error}`);
    ctx.response.body = { msg: error };
  }
};

export const deleteProduct = async (ctx: Context) => {
  try {
    ctx.response.status = 200;
    logger.debug(`status: ${ctx.response.status} method: deleteProduct handler`);
    const { userId } = helpers.getQuery(ctx, { mergeParams: true });
    const productIndex = await DB_PRODUCTS.findIndex((p) => p.uuid == userId);
    if (productIndex !== -1) {
      DB_PRODUCTS.splice(productIndex, 1);
      ctx.response.body = { code: "00", msg: `Usuario con id ${userId} eliminado` };
    } else {
      ctx.response.body = { code: "01", msg: `Usuario con id ${userId} no encontrado.` };
    }
  } catch (error) {
    ctx.response.status = 500;
    logger.error(`status: ${ctx.response.status} ${error}`);
    ctx.response.body = { msg: error };
  }
};
