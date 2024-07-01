import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { Neo4jService } from '@/neo4j/neo4j.service';

describe('AppController', () => {
  let appController: AppController;
  let neo4jService: Neo4jService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [Neo4jService],
    }).compile();

    appController = app.get<AppController>(AppController);
    neo4jService = app.get<Neo4jService>(Neo4jService);
  });

  describe('count-nodes', () => {
    it('should return the count of nodes in the database', async () => {

      // Make the request to the count-nodes endpoint
      const result = await appController.getCount();

      expect(result).toMatch(/There are \d+ nodes in the database/);
    });
  });
});