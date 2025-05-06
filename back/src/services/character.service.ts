import db from '../models';
import { Op, Order, WhereOptions } from 'sequelize';
import { RedisClientType } from 'redis';

const CACHE_TTL_CHARACTER_SECONDS = 3600;
const CACHE_TTL_CHARACTERS_LIST_SECONDS = 600;

interface FindCharactersOptions {
  filter?: {
    name?: string;
    status?: string;
    species?: string;
    gender?: string;
    originName?: string;
    occupation?: string;
    starred?: boolean;
  };
  sortByName?: string;
}

export const findCharacterById = async (
  id: string | number,
  redis: RedisClientType
): Promise<any | null> => {
  const cacheKey = id.toString();

  if (redis?.isOpen) {
    try {
      console.log(`[Service] Serching Redis Cache: ${cacheKey}`);
      const cachedData = await redis.get(cacheKey);
      if (cachedData) {
        console.log(`[Service] Cache HIT: ${cacheKey}`);
        console.log(`[Service] Cache HIT: ${cacheKey} - ${cachedData}`);
        return JSON.parse(cachedData);
      }
      console.log(`[Service] Cache MISS: ${cacheKey}`);
    } catch (err) {
      console.error(`[Service] Error Redis GET ${cacheKey}:`, err);
    }
  } else {
    console.warn('[Service] Redis not connected, skipping cache for GET.');
  }

  console.log(`[Service] Searching Character in DB with ID: ${id}`);
  try {
    const characterInstance = await db.Character.findByPk(id);

    if (characterInstance) {
      console.log(`[Service] Character ${id} found in DB.`);
      const plainCharacter = characterInstance.toJSON();

      if (redis?.isOpen) {
        try {
          redis
            .setEx(
              cacheKey,
              CACHE_TTL_CHARACTER_SECONDS,
              JSON.stringify(plainCharacter)
            )
            .then(() =>
              console.log(
                `[Service] Cache SET: ${cacheKey} (TTL: ${CACHE_TTL_CHARACTER_SECONDS}s)`
              )
            )
            .catch((err) =>
              console.error(`[Service] Error Redis SETEX ${cacheKey}:`, err)
            );
        } catch (syncErr) {
          console.error(
            `[Service] Error Redis SETEX sync ${cacheKey}:`,
            syncErr
          );
        }
      }
      return plainCharacter;
    } else {
      console.log(`[Service] Character ${id} not found in DB.`);
      return null;
    }
  } catch (error) {
    console.error(`[Service] Error: `, error);
    throw new Error('Error trying to get character by ID.');
  }
};

export const findCharacters = async (
  options: FindCharactersOptions = {},
  redis: RedisClientType
) => {
  const { filter = {}, sortByName } = options;

  const filterKeyPart = JSON.stringify(filter);
  const sortKeyPart = sortByName || 'none'; 
  const cacheKey = `characters:filter:${filterKeyPart}:sort:${sortKeyPart}`;
  console.log(`[Service] Cache Key generated: ${cacheKey}`);

  if (redis?.isOpen) {
    try {
      console.log(`[Service] Searching in Redis Cache: ${cacheKey}`);
      const cachedData = await redis.get(cacheKey);
      if (cachedData) {
        console.log(`[Service] Cache HIT: ${cacheKey}`);
        return JSON.parse(cachedData);
      }
      console.log(`[Service] Cache MISS: ${cacheKey}`);
    } catch (err) {
      console.error(`[Service] Error Redis GET ${cacheKey}:`, err);
    }
  } else {
    console.warn('[Service] Redis not connected, skipping cache for GET.');
  }

  const whereClause: WhereOptions = {};
  if (filter.name) {
    whereClause.name = { [Op.like]: `%${filter.name}%` };
  }
  if (filter.status) {
    whereClause.status = filter.status;
  }
  if (filter.species) {
    whereClause.species = filter.species;
  }
  if (filter.gender) {
    whereClause.gender = filter.gender;
  }
  if (filter.originName) {
    whereClause.originName = { [Op.like]: `%${filter.originName}%` };
  }
  if (filter.occupation) {
    whereClause.occupation = { [Op.like]: `%${filter.occupation}%` };
  }
  if (typeof filter.starred === 'boolean') {
    whereClause.starred = filter.starred;
    console.log(`[Service] Adding WHERE for starred = ${filter.starred}`);
  }

  console.log(
    '[Service] Searchong for characters with WHERE clause:',
    whereClause
  );

  let orderClause: Order = [['id', 'ASC']]; 
  if (sortByName === 'ASC') {
      orderClause = [['name', 'ASC']]; 
       console.log('[Service] Applying ORDER BY name ASC');
  } else if (sortByName === 'DESC') {
      orderClause = [['name', 'DESC']]; 
      console.log('[Service] Applying ORDER BY name DESC');
  }

  try {
    const charactersInstances = await db.Character.findAll({
      where: whereClause,
      order: orderClause,
    });

    console.log(
      `[Service] Found ${charactersInstances.length} characters in DB.`
    );
    const plainResults = charactersInstances.map((instance) =>
      instance.toJSON()
    );

    if (redis?.isOpen) {
      try {
        redis
          .setEx(
            cacheKey,
            CACHE_TTL_CHARACTERS_LIST_SECONDS,
            JSON.stringify(plainResults)
          )
          .then(() =>
            console.log(
              `[Service] Cache SET: ${cacheKey} (TTL: ${CACHE_TTL_CHARACTERS_LIST_SECONDS}s)`
            )
          )
          .catch((err) =>
            console.error(`[Service] Error Redis SETEX ${cacheKey}:`, err)
          );
      } catch (syncErr) {
        console.error(`[Service] Error Redis SETEX sync ${cacheKey}:`, syncErr);
      }
    }
    return plainResults;
  } catch (error) {
    console.error('[Service] Error:', error);
    throw new Error('Error trying to get characters.');
  }
};

/**
 * Update the starred status of a character in the database and invalidate the Redis cache.
 * @param id - ID of the character to update.
 * @param starred - New starred status (true or false).
 * @param redis - Redis client instance for cache invalidation.
 * @returns The updated character object or null if not found.
 */
export const updateStarredStatus = async (
  id: string | number,
  starred: boolean,
  redis: RedisClientType
): Promise<any | null> => {
  console.log(
    `[Service] Updating starred status for Character ID: ${id} to ${starred}`
  );
  try {
    const [numberOfAffectedRows] = await db.Character.update(
      { starred: starred },
      { where: { id: id } }
    );

    if (numberOfAffectedRows > 0) {
      console.log(`[Service] Character ${id} updated successfully.`);

      if (redis?.isOpen) {
        console.log(
          `[Service] Invalidating Redis cache for character ${id}...`
        );
        try {
          const singleCharKey = `character:${id}`;
          const listStarredKey = `characters:filter:{"starred":true}`;
          const listNotStarredKey = `characters:filter:{"starred":false}`;

          const deletedCount = await redis.del([
            singleCharKey,
            listStarredKey,
            listNotStarredKey,
          ]);
          console.log(`[Service] Cache keys deleted: ${deletedCount}`);
        } catch (cacheErr) {
          console.error(`[Service]Error deleting cahce: `, cacheErr);
        }
      } else {
        console.warn(
          '[Service] Redis not connected, skipping cache invalidation.'
        );
      }

      console.log(`[Service] Fetching updated character from DB...`);
      const updatedCharacter = await db.Character.findByPk(id);
      return updatedCharacter ? updatedCharacter.toJSON() : null;
    } else {
      console.log(`[Service] Character ${id} not found or no changes made.`);
      return null;
    }
  } catch (error) {
    console.error(`[Service] Error: `, error);
    throw new Error('Error trying to update character starred status.');
  }
};
