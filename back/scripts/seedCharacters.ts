import 'dotenv/config';
import db from '../src/models';
import * as apiClient from '../src/clients/rickAndMorty.client';

async function seedDatabase() {
  console.log('Initializing database seeding...');

  try {
    console.log('Syncing database...');
    await db.Character.sync({ force: true });
    console.log('Characters table synced successfully.');
    console.log('Getting characters from Rick and Morty API...');
    const apiResponse = await apiClient.fetchCharacters(1);

    if (
      !apiResponse ||
      !apiResponse.results ||
      apiResponse.results.length === 0
    ) {
      throw new Error('No characters found in API response.');
    }
    console.log(`Found ${apiResponse.results.length} characters in the API.`);

    const charactersToSeed = apiResponse.results
      .slice(0, 15)
      .map((apiChar: any) => {
        console.log(apiChar);
        return {
          id: apiChar.id,
          name: apiChar.name,
          status: apiChar.status,
          species: apiChar.species,
          type: apiChar.type || '',
          gender: apiChar.gender,
          originName: apiChar.origin?.name || null,
          locationName: apiChar.location?.name || null,
          image: apiChar.image,
          starred: false,
        };
      });
    console.log(
      `Preparing to insert ${charactersToSeed.length} characters into the database...`
    );

    await db.Character.bulkCreate(charactersToSeed);
    console.log('Characters seeded successfully.');
  } catch (error) {
    console.error('Error during seeding', error);
    process.exit(1);
  } finally {
    await db.sequelize.close();
    console.log('Database connection closed.');
  }
}

seedDatabase();
