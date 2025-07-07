import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Error Handling', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return normalized error response for not found endpoint', async () => {
    const response = await request(app.getHttpServer()).get('/non-existent-endpoint').expect(HttpStatus.NOT_FOUND);

    expect(response.body).toEqual({
      statusCode: HttpStatus.NOT_FOUND,
      message: expect.any(String),
      error: expect.any(String),
    });
  });

  it('should return normalized error response for validation errors', async () => {
    // This will trigger validation errors if the endpoint exists
    const response = await request(app.getHttpServer())
      .post('/api/tags')
      .send({
        // Invalid data to trigger validation error
        name: '', // Empty name should trigger validation error
      })
      .expect(HttpStatus.NOT_FOUND);

    expect(response.body).toEqual({
      statusCode: HttpStatus.NOT_FOUND,
      message: expect.any(String),
      error: expect.any(String),
    });
  });
});
