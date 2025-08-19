import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      url:
        process.env.DATABASE_URL ||
        'postgresql://neondb_owner:npg_Va1MtloAjH6O@ep-jolly-wildflower-a83ddyri-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require',
      synchronize: true,
      logging: true,
      ssl: {
        rejectUnauthorized: false,
      },
      autoLoadEntities: true,
    }),

    UsersModule,

    AdminModule,


    // MailerModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     transport: {
    //       service: 'gmail',
    //       auth: {
    //         user: 'aimspurified@gmail.com',
    //         pass: 'oxcs lnyq twnf exyz',
    //       },
    //     },
    //     defaults: {
    //       from: 'aimspurified@gmail.com',
    //     },
    //     template: {
    //       dir: join(__dirname, 'templates/email'),
    //       adapter: new HandlebarsAdapter(),
    //       options: {
    //         strict: true,
    //       },
    //     },
    //   }),
    //   inject: [ConfigService],
    // }),


  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
