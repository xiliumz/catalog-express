import { v4 } from 'uuid';
import { prismaClient } from '../application/database';
import { createCatalogValidation, getAllCatalogValidation } from '../validation/catalog-validation';
import { validation } from '../validation/validate';
import ResponseError from '../error/response-error';

const create = async (request) => {
  const result = validation(createCatalogValidation, request);
  const id = v4();

  const catalog = await prismaClient.catalog.create({
    data: {
      title: result.title,
      desc: result.desc,
      id,
      user_id: result.username,
    },
    include: {
      user: true,
    },
  });

  return catalog;
};

const getAll = async (request) => {
  const result = await validation(getAllCatalogValidation, request);
  const catalogs = await prismaClient.user.findUnique({
    where: {
      username: result,
    },
    include: {
      catalog: true,
    },
  });

  if (!catalogs) {
    throw new ResponseError(404, `Username '${result}' not found`);
  }

  return catalogs;
};

export default { create, getAll };
