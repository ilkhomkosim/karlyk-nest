import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { MemberModule } from '../member/member.module';
import MessageSchema from '../../schemas/Message.model';
import MemberSchema from '../../schemas/Member.model';
import { PropertyModule } from '../property/property.module';
import { NotificationModule } from '../notifications/notification.module';
import { MessageResolver } from './messaging.resolver';
import { MessageService } from './messaging.service';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'Member', schema: MemberSchema }]),
		MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }]),
		AuthModule,
		MemberModule,
		PropertyModule,
		NotificationModule,
		MemberModule,
	],
	providers: [MessageResolver, MessageService],
	exports: [MessageModule],
})
export class MessageModule {}