import { Module } from '@nestjs/common';
import { ResourceAppService } from './resource-app.service';
import { ResourceAppController } from './resource-app.controller';
import { ResourceAppHelper } from './helper/resource-app.helper';
import { MongooseModule } from '@nestjs/mongoose';
import { ResourceApp, ResourceAppSchema } from './schema/resource-app.schema';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ResourceApp.name, schema: ResourceAppSchema },
    ]),
    UserModule,
    AuthModule,
  ],
  controllers: [ResourceAppController],
  providers: [
    {
      provide: 'IResourceAppService',
      useClass: ResourceAppService,
    },
    {
      provide: 'IResourceAppHelper',
      useClass: ResourceAppHelper,
    },
  ],
  exports: [
    {
      provide: 'IResourceAppHelper',
      useClass: ResourceAppHelper,
    },
  ],
})
export class ResourceAppModule {}
