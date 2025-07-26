import { logger } from '@/infra/logger';
import { metrics } from '@/infra/metrics';
import { withTracing } from '@/infra/tracing';

// Mock Prisma client - replace with actual prisma import
interface PrismaClient {
  featureNamespace: {
    findFirst: (query: any) => Promise<any>;
    create: (data: any) => Promise<any>;
    upsert: (data: any) => Promise<any>;
  };
  featureRow: {
    create: (data: any) => Promise<any>;
    findFirst: (query: any) => Promise<any>;
    findMany: (query: any) => Promise<any[]>;
    deleteMany: (query: any) => Promise<any>;
  };
}

// This would be your actual prisma client
let prisma: PrismaClient;

export function initFeatureStore(client: PrismaClient) {
  prisma = client;
}

export interface FeatureWriteInput {
  namespace: string;
  entity: string;
  entityId: string;
  features: Record<string, number | string | boolean | null>;
  ts?: Date;
  ttlDays?: number;
}

export interface FeatureReadOptions {
  asOf?: Date;
  includeExpired?: boolean;
}

export class FeatureStoreService {
  private static instance: FeatureStoreService;
  
  static getInstance(): FeatureStoreService {
    if (!FeatureStoreService.instance) {
      FeatureStoreService.instance = new FeatureStoreService();
    }
    return FeatureStoreService.instance;
  }

  async writeFeatures(input: FeatureWriteInput): Promise<string> {
    return withTracing('feature-store.write', async (span) => {
      const startTime = Date.now();
      
      span.setAttributes({
        'fs.namespace': input.namespace,
        'fs.entity': input.entity,
        'fs.entity_id': input.entityId,
        'fs.feature_count': Object.keys(input.features).length,
      });

      try {
        // Ensure namespace exists
        const namespace = await this.ensureNamespace(input.namespace);
        
        // Create feature row
        const featureRow = await prisma.featureRow.create({
          data: {
            namespaceId: namespace.id,
            entity: input.entity,
            entityId: input.entityId,
            features: input.features,
            ts: input.ts || new Date(),
            ttlDays: input.ttlDays,
          }
        });

        logger.info({
          msg: 'Features written successfully',
          namespace: input.namespace,
          entity: input.entity,
          entityId: input.entityId,
          featureCount: Object.keys(input.features).length,
          rowId: featureRow.id,
        });

        // Update metrics
        metrics.featureWrites.inc({
          namespace: input.namespace,
          entity_type: input.entity,
        });

        metrics.histogram('feature_write_duration_ms', {
          namespace: input.namespace,
        }).observe(Date.now() - startTime);

        return featureRow.id;

      } catch (error) {
        logger.error({
          msg: 'Failed to write features',
          namespace: input.namespace,
          entity: input.entity,
          entityId: input.entityId,
          error: error instanceof Error ? error.message : 'Unknown error',
        });

        span.recordException(error instanceof Error ? error : new Error(String(error)));
        throw error;
      }
    });
  }

  async readLatest(
    namespace: string,
    entity: string,
    entityId: string,
    options: FeatureReadOptions = {}
  ): Promise<Record<string, any> | null> {
    return withTracing('feature-store.read-latest', async (span) => {
      const startTime = Date.now();
      
      span.setAttributes({
        'fs.namespace': namespace,
        'fs.entity': entity,
        'fs.entity_id': entityId,
        'fs.as_of': options.asOf?.toISOString() || 'latest',
      });

      try {
        const namespaceRecord = await prisma.featureNamespace.findFirst({
          where: { name: namespace }
        });

        if (!namespaceRecord) {
          logger.debug({
            msg: 'Namespace not found',
            namespace,
          });
          return null;
        }

        const whereClause: any = {
          namespaceId: namespaceRecord.id,
          entity,
          entityId,
        };

        // Add time constraints
        if (options.asOf) {
          whereClause.ts = { lte: options.asOf };
        }

        // Add TTL constraint unless explicitly including expired
        if (!options.includeExpired) {
          whereClause.OR = [
            { ttlDays: null }, // No expiration
            {
              ttlDays: { not: null },
              createdAt: {
                gte: new Date(Date.now() - (365 * 24 * 60 * 60 * 1000)) // Max 1 year ago as fallback
              }
            }
          ];
        }

        const featureRow = await prisma.featureRow.findFirst({
          where: whereClause,
          orderBy: { ts: 'desc' },
        });

        if (!featureRow) {
          logger.debug({
            msg: 'No features found',
            namespace,
            entity,
            entityId,
          });
          return null;
        }

        // Check if expired
        if (featureRow.ttlDays && !options.includeExpired) {
          const expirationDate = new Date(
            featureRow.createdAt.getTime() + (featureRow.ttlDays * 24 * 60 * 60 * 1000)
          );
          
          if (new Date() > expirationDate) {
            logger.debug({
              msg: 'Features expired',
              namespace,
              entity,
              entityId,
              expirationDate,
            });
            return null;
          }
        }

        logger.debug({
          msg: 'Features read successfully',
          namespace,
          entity,
          entityId,
          featureCount: Object.keys(featureRow.features as object).length,
          timestamp: featureRow.ts,
        });

        // Update metrics
        metrics.featureReads.inc({
          namespace,
          entity_type: entity,
        });

        metrics.histogram('feature_read_duration_ms', {
          namespace,
        }).observe(Date.now() - startTime);

        return featureRow.features as Record<string, any>;

      } catch (error) {
        logger.error({
          msg: 'Failed to read features',
          namespace,
          entity,
          entityId,
          error: error instanceof Error ? error.message : 'Unknown error',
        });

        span.recordException(error instanceof Error ? error : new Error(String(error)));
        throw error;
      }
    });
  }

  async readTimeSeries(
    namespace: string,
    entity: string,
    entityId: string,
    fromDate: Date,
    toDate: Date
  ): Promise<Array<{ timestamp: Date; features: Record<string, any> }>> {
    return withTracing('feature-store.read-time-series', async (span) => {
      span.setAttributes({
        'fs.namespace': namespace,
        'fs.entity': entity,
        'fs.entity_id': entityId,
        'fs.from_date': fromDate.toISOString(),
        'fs.to_date': toDate.toISOString(),
      });

      try {
        const namespaceRecord = await prisma.featureNamespace.findFirst({
          where: { name: namespace }
        });

        if (!namespaceRecord) {
          return [];
        }

        const featureRows = await prisma.featureRow.findMany({
          where: {
            namespaceId: namespaceRecord.id,
            entity,
            entityId,
            ts: {
              gte: fromDate,
              lte: toDate,
            },
          },
          orderBy: { ts: 'asc' },
        });

        return featureRows.map(row => ({
          timestamp: row.ts,
          features: row.features as Record<string, any>,
        }));

      } catch (error) {
        logger.error({
          msg: 'Failed to read time series features',
          namespace,
          entity,
          entityId,
          error: error instanceof Error ? error.message : 'Unknown error',
        });

        span.recordException(error instanceof Error ? error : new Error(String(error)));
        throw error;
      }
    });
  }

  async cleanup(namespace: string, olderThanDays: number): Promise<number> {
    return withTracing('feature-store.cleanup', async (span) => {
      span.setAttributes({
        'fs.namespace': namespace,
        'fs.older_than_days': olderThanDays,
      });

      try {
        const cutoffDate = new Date(Date.now() - (olderThanDays * 24 * 60 * 60 * 1000));
        
        const namespaceRecord = await prisma.featureNamespace.findFirst({
          where: { name: namespace }
        });

        if (!namespaceRecord) {
          return 0;
        }

        const result = await prisma.featureRow.deleteMany({
          where: {
            namespaceId: namespaceRecord.id,
            createdAt: { lt: cutoffDate },
          },
        });

        logger.info({
          msg: 'Feature store cleanup completed',
          namespace,
          deletedCount: result.count,
          cutoffDate,
        });

        return result.count;

      } catch (error) {
        logger.error({
          msg: 'Failed to cleanup feature store',
          namespace,
          error: error instanceof Error ? error.message : 'Unknown error',
        });

        span.recordException(error instanceof Error ? error : new Error(String(error)));
        throw error;
      }
    });
  }

  private async ensureNamespace(name: string): Promise<any> {
    return prisma.featureNamespace.upsert({
      where: { name },
      update: {},
      create: {
        name,
        description: `Auto-created namespace for ${name}`,
      },
    });
  }

  // Utility methods for common feature patterns
  async writeCulturalFeatures(
    brandId: string,
    features: {
      belongingIndex?: number;
      meaningShift?: number;
      culturalResonance?: number;
      identityStrength?: number;
    },
    options: { ttlDays?: number } = {}
  ): Promise<string> {
    return this.writeFeatures({
      namespace: 'cultural',
      entity: 'brand',
      entityId: brandId,
      features,
      ttlDays: options.ttlDays || 365,
    });
  }

  async writeEmployeeFeatures(
    employeeId: string,
    features: {
      performanceScore?: number;
      culturalFit?: number;
      technicalSkill?: number;
      leadershipPotential?: number;
    },
    options: { ttlDays?: number } = {}
  ): Promise<string> {
    return this.writeFeatures({
      namespace: 'hr',
      entity: 'employee',
      entityId: employeeId,
      features,
      ttlDays: options.ttlDays || 1095, // 3 years
    });
  }

  async writeProjectFeatures(
    projectId: string,
    features: {
      progressScore?: number;
      budgetEfficiency?: number;
      clientSatisfaction?: number;
      teamCollaboration?: number;
    },
    options: { ttlDays?: number } = {}
  ): Promise<string> {
    return this.writeFeatures({
      namespace: 'projects',
      entity: 'project',
      entityId: projectId,
      features,
      ttlDays: options.ttlDays || 2190, // 6 years
    });
  }
}

// Global service instance
export const featureStore = FeatureStoreService.getInstance();

// Convenience functions
export async function writeFeatures(input: FeatureWriteInput): Promise<string> {
  return featureStore.writeFeatures(input);
}

export async function readLatest(
  namespace: string,
  entity: string,
  entityId: string,
  options?: FeatureReadOptions
): Promise<Record<string, any> | null> {
  return featureStore.readLatest(namespace, entity, entityId, options);
}

export async function readTimeSeries(
  namespace: string,
  entity: string,
  entityId: string,
  fromDate: Date,
  toDate: Date
): Promise<Array<{ timestamp: Date; features: Record<string, any> }>> {
  return featureStore.readTimeSeries(namespace, entity, entityId, fromDate, toDate);
}

