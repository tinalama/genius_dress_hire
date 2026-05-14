import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import databaseConfig from './config/database/database.config';
import { envValidationSchema } from './config/env/env.validation';

import { LoggerMiddleware } from './common-module/middleware/logger.middleware';
import { ResponseTransformInterceptor } from './common-module/interceptors/response-transform.interceptor';

import { CustomHttpExceptionFilter } from './common-module/exception-filters/custom-http.exception-filter';
import { ForbiddenExceptionFilter } from './common-module/exception-filters/forbidden.exception-filter';
import { InternalErrorExceptionsFilter } from './common-module/exception-filters/internal-error.exception-filter';
import { NotFoundExceptionFilter } from './common-module/exception-filters/not-found.exception-filter';
import { UnauthorizedExceptionFilter } from './common-module/exception-filters/unauthorized.exception-filter';
import { ValidationExceptionFilter } from './common-module/exception-filters/validation.exception-filter';

import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';

// =====================================================================
// TODO: Infrastructure modules to wire as packages get installed.
// Style mirrors the TTC employee-panel app.module.ts.
//
// import { ScheduleModule } from '@nestjs/schedule';
// import { ThrottlerModule } from '@nestjs/throttler';
// import { EventEmitterModule } from '@nestjs/event-emitter';
// import { WinstonModule, WinstonModuleOptions } from 'nest-winston';
// import { RequestContextModule, RequestUserContext } from '@app/request-context';
// import { S3HelperModule } from '@app/s3-helper';
// import { CustomThrottlerGuard, I18nExceptionFilterPipe, CustomValidationPipe }
//   from '@app/common-module';
// import { throttleConfig } from '@app/config/config/throttle-config';
// import winstonConfig from '@app/config/config/winston';
// import { getConfig, AppConfig, winstonTransports } from '@app/config';
// =====================================================================

// =====================================================================
// TODO: Feature modules — uncomment each as the corresponding folder
// under `src/modules/` is created.
//
// import { RolesModule } from './modules/role/roles.module';
// import { PermissionsModule } from './modules/permission/permissions.module';
// import { MailModule } from './modules/mail/mail.module';
// import { EmailTemplateModule } from './modules/email-template/email-template.module';
// import { RefreshTokenModule } from './modules/refresh-token/refresh-token.module';
// import { TwofaModule } from './modules/twofa/twofa.module';
// import { DashboardModule } from './modules/dashboard/dashboard.module';
// import { FrontendUserModule } from './modules/frontend-user/frontend-user.module';
// import { CommonModule } from './modules/common/common.module';
// import { AdminActivityLogModule } from './modules/admin-activity-logs/admin-activity-log.module';
// import { LanguageModule } from './modules/language/language.module';
// import { ApiLogsModule } from './modules/api-logs/api-logs.module';
// import { ScheduleEmailModule } from './modules/schedule-email/schedule-email.module';
// import { DepartmentsModule } from './modules/departments/departments.module';
// import { CompaniesModule } from './modules/companies/companies.module';
// import { RedisModule } from './modules/redis/redis.module';
// import { AppCacheModule } from './modules/cache/cache.module';
// import { EventsModule } from './modules/events/events.module';
// import { EmployeesModule } from './modules/employees/employees.module';
// import { PostalCodesModule } from './modules/postal-codes/postal-codes.module';
// import { ProductModule } from './modules/product/product.module';
// import { ExpensesModule } from './modules/expenses/expenses.module';
// import { StoreContractsModule } from './modules/store-contracts/store-contracts.module';
// import { SupplierVendorsModule } from './modules/supplier-vendors/supplier-vendors.module';
// import { OrdersModule } from './modules/orders/orders.module';
// import { CompanyOrdersModule } from './modules/company-orders/company-orders.module';
// import { DataSyncModule } from './modules/data-sync/data-sync.module';
// import { ReviewManagementMasterModule } from './modules/review-management-master/review-management-master.module';
// import { ReviewManagementModule } from './modules/review-management/review-management.module';
// import { ProductRegistrationModule } from './modules/product-registration/product-registration.module';
// import { FeedbackModule } from './modules/feedback/feedback.module';
// import { WebhookModule } from './modules/webhook/webhook.module';
// =====================================================================

@Module({
  imports: [
    // ---------- Configuration ----------
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [databaseConfig],
      validationSchema: envValidationSchema,
      validationOptions: {
        abortEarly: true,
        allowUnknown: true,
      },
    }),

    // ---------- Infrastructure (TODO: wire as packages are installed) ----------
    // RequestContextModule.forRoot({
    //   contextClass: RequestUserContext,
    //   isGlobal: true,
    // }),
    // ScheduleModule.forRoot(),
    // EventEmitterModule.forRoot(),
    // WinstonModule.forRoot({
    //   ...winstonConfig,
    //   transports: [
    //     winstonTransports('logs/backend-api').console,
    //     winstonTransports('logs/backend-api').combinedFile,
    //     winstonTransports('logs/backend-api').errorFile,
    //   ],
    //   defaultMeta: { service: 'genius-dress-hire-api' },
    // } as WinstonModuleOptions),
    // ThrottlerModule.forRootAsync({ useFactory: () => throttleConfig }),
    // I18n is intentionally skipped for now.

    // ---------- Database ----------
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService): TypeOrmModuleOptions =>
        config.get<TypeOrmModuleOptions>('database') as TypeOrmModuleOptions,
    }),

    // ---------- Shared / SDK modules (TODO) ----------
    // S3HelperModule,

    // ---------- Feature modules ----------
    AuthModule,
    // RolesModule,
    // PermissionsModule,
    // MailModule,
    // EmailTemplateModule,
    // RefreshTokenModule,
    // TwofaModule,
    // DashboardModule,
    // FrontendUserModule,
    // CommonModule,
    // AdminActivityLogModule,
    // LanguageModule,
    // ApiLogsModule,
    // ScheduleEmailModule,
    // DepartmentsModule,
    // CompaniesModule,
    // RedisModule,
    // AppCacheModule,
    // EventsModule,
    // EmployeesModule,
    // PostalCodesModule,
    // ProductModule,
    // ExpensesModule,
    // StoreContractsModule,
    // SupplierVendorsModule,
    // OrdersModule,
    // CompanyOrdersModule,
    // DataSyncModule,
    // ReviewManagementMasterModule,
    // ReviewManagementModule,
    // ProductRegistrationModule,
    // FeedbackModule,
    // WebhookModule,
  ],

  controllers: [AppController],

  providers: [
    // Replace with `CustomValidationPipe` from @app/common-module once it lands.
    {
      provide: APP_PIPE,
      useFactory: (): ValidationPipe =>
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
          transform: true,
          transformOptions: { enableImplicitConversion: true },
        }),
    },

    // TODO: swap for `CustomThrottlerGuard` after installing `@nestjs/throttler`.
    // {
    //   provide: APP_GUARD,
    //   useClass: CustomThrottlerGuard,
    // },

    { provide: APP_INTERCEPTOR, useClass: ResponseTransformInterceptor },

    // TODO: replace with `I18nExceptionFilterPipe` once `nestjs-i18n` is wired.
    { provide: APP_FILTER, useClass: InternalErrorExceptionsFilter },
    { provide: APP_FILTER, useClass: ValidationExceptionFilter },
    { provide: APP_FILTER, useClass: CustomHttpExceptionFilter },
    { provide: APP_FILTER, useClass: UnauthorizedExceptionFilter },
    { provide: APP_FILTER, useClass: ForbiddenExceptionFilter },
    { provide: APP_FILTER, useClass: NotFoundExceptionFilter },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
