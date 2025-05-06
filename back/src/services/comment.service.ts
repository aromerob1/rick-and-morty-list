import db from '../models'; 
import { RedisClientType } from 'redis'; 

interface CreateCommentData {
    characterId: string | number;
    commentText: string;
}

/**
 * Create a new comment for a character.
 */
export const createComment = async (data: CreateCommentData, redis?: RedisClientType): Promise<any> => {
    console.log(`[Service] Creando comentario para Character ID: ${data.characterId}`);
    try {
        const newComment = await db.Comment.create({
            characterId: Number(data.characterId), 
            commentText: data.commentText
        });
        if (redis?.isOpen) {
            const characterCacheKey = `character:${data.characterId}`;
            console.log(`[Service] Invalidando caché de personaje: ${characterCacheKey} por nuevo comentario.`);
            try {
                await redis.del(characterCacheKey);
            } catch (cacheErr) {
                console.error(`[Service] Error al borrar caché de Redis para ${characterCacheKey}:`, cacheErr);
            }
        }

        return newComment.toJSON();
    } catch (error) {
        console.error('[Service] Error al crear comentario:', error);
        throw new Error('Error al guardar el comentario.');
    }
};

/**
 * Find comments by character ID.
 * @param characterId - ID of the character to find comments for.
 * @param redis - Optional Redis client instance for caching.
 * @returns An array of comments associated with the character.
 * @throws Error if there is an issue retrieving comments.
 */
export const findCommentsByCharacterId = async (characterId: string | number, redis?: RedisClientType): Promise<any[]> => {
    console.log(`[Service] Buscando comentarios para Character ID: ${characterId}`);
    try {
        const comments = await db.Comment.findAll({
            where: { characterId: Number(characterId) },
            order: [['createdAt', 'DESC']], 
        });
        return comments.map(comment => comment.toJSON());
    } catch (error) {
        console.error(`[Service] Error al buscar comentarios para Character ${characterId}:`, error);
        throw new Error('Error al obtener los comentarios.');
    }
};