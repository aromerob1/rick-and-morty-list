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
    console.log(`[Service] Creating comment for id: ${data.characterId}`);
    try {
        const newComment = await db.Comment.create({
            characterId: Number(data.characterId), 
            commentText: data.commentText
        });
        const plainComment = {
            id: newComment.id, 
            commentText: '',
            characterId: '',
            createdAt: '',
            updatedAt: '',
        };
        if (redis?.isOpen) {
            const characterCacheKey = `character:${data.characterId}`;
            console.log(`[Service] Invalidating cache for character ID: ${characterCacheKey}`);
            try {
                await redis.del(characterCacheKey);
            } catch (cacheErr) {
                console.error(`[Service] Error: ${characterCacheKey}:`, cacheErr);
            }
        }

        return plainComment; 
    } catch (error) {
        console.error('[Service] Error creating comment:', error);
        throw new Error('Error saving comment');
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
    console.log(`[Service] Searchng: ${characterId}`);
    try {
        const comments = await db.Comment.findAll({
            where: { characterId: Number(characterId) },
            order: [['createdAt', 'DESC']], 
        });
        return comments.map(comment => comment.toJSON());
    } catch (error) {
        console.error(`[Service] Error: ${characterId}:`, error);
        throw new Error('Error getting comments');
    }
};