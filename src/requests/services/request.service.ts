import { Injectable, Logger } from '@nestjs/common';
import { REQUESTS } from '@requests/constants/request.constants';
import { AwsDynamodbService } from '@workshop/lib-nest-aws/dist/services/dynamodb';
import { WeatherRequestEntity } from '@requests/entities/weather.request.entity';
import { EntityManager } from '@typedorm/core';
import { EntityAttributes } from '@typedorm/common';
import {
  EntityManagerCountOptions,
  EntityManagerFindOptions,
  EntityManagerUpdateOptions,
} from '@typedorm/core/cjs/src/classes/manager/entity-manager';
import { FindResults } from '@requests/types/aws.dynamodb.types';
import { UpdateBody } from '@typedorm/core/esm/src/classes/expression/update-body-type';

@Injectable()
export class RequestService {
  private readonly logger = new Logger(RequestService.name);

  private readonly entityManager: EntityManager;

  constructor(private readonly awsDynamodbService: AwsDynamodbService) {
    this.entityManager = this.awsDynamodbService.getEntityManager(REQUESTS);
  }

  async count({
    partitionKey,
    queryOptions,
  }: {
    partitionKey: Partial<EntityAttributes<WeatherRequestEntity>>;
    queryOptions: EntityManagerCountOptions<WeatherRequestEntity, Partial<EntityAttributes<WeatherRequestEntity>>>;
  }): Promise<number> {
    return this.entityManager.count(WeatherRequestEntity, partitionKey, queryOptions);
  }

  async find({
    partitionKey,
    queryOptions,
  }: {
    partitionKey: Partial<EntityAttributes<WeatherRequestEntity>>;
    queryOptions: EntityManagerFindOptions<WeatherRequestEntity, any>;
  }): Promise<FindResults<WeatherRequestEntity>> {
    return this.entityManager.find(WeatherRequestEntity, partitionKey, queryOptions);
  }

  async update({
    primaryKeyAttributes,
    body,
    queryOptions,
  }: {
    primaryKeyAttributes: Partial<WeatherRequestEntity>;
    body: UpdateBody<Omit<WeatherRequestEntity, 'createdAt'>, Omit<WeatherRequestEntity, 'createdAt'>>;
    queryOptions?: EntityManagerUpdateOptions<WeatherRequestEntity>;
  }): Promise<any> {
    return this.entityManager.update(
      WeatherRequestEntity,
      primaryKeyAttributes,
      // @ts-ignore
      body,
      queryOptions,
    );
  }
}
