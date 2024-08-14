/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Follower, Followers, Following, Followings } from '../../libs/dto/follow/follow';
import { Model, ObjectId } from 'mongoose';
import { MemberService } from '../member/member.service';
import { Direction, Message } from '../../libs/enums/common.enum';
import { FollowInquiry } from '../../libs/dto/follow/follow.input';
import {
	lookupAuthMemberFollowed,
	lookupAuthMemberLiked,
	lookupFollowerData,
	lookupFollowingData,
} from '../../libs/config';
import { T } from '../../libs/types/common';
import { Member } from '../../libs/dto/member/member';
import { NotificationInput } from '../../libs/dto/notification/notification.input';
import { NotificationGroup, NotificationStatus, NotificationType } from '../../libs/enums/notification.enum';
import { MemberStatus } from '../../libs/enums/member.enum';
import { NotificationService } from '../notifications/notification.service';

@Injectable()
export class FollowService {
	constructor(
		@InjectModel('Follow') private readonly followModel: Model<Follower | Following>,
		@InjectModel('Member') private readonly memberModel: Model<Member>,
		private readonly memberService: MemberService,
		private readonly notificationService: NotificationService,
	) {}

	public async subscribe(followerId: ObjectId, followingId: ObjectId): Promise<Follower> {
		if (followerId.toString() === followingId.toString()) {
			throw new InternalServerErrorException(Message.SELF_SUBSCRIPTION_DENIED);
		}

		const targetMember = await this.memberService.getMember(null, followingId);
		if (!targetMember) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		const result = await this.registerSubscription(followerId, followingId);

		//notification
		const authMember: Member = await this.memberModel
			.findOne({ _id: followerId, memberStatus: MemberStatus.ACTIVE })
			.exec();
		if (!authMember) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		const notificInput: NotificationInput = {
			notificationGroup: NotificationGroup.ARTICLE,
			notificationType: NotificationType.SUBSCRIBE,
			notificationStatus: NotificationStatus.WAIT,
			notificationTitle: `Follow`,
			notificationDesc: `${authMember.memberNick} followed you `,
			authorId: followerId,
			receiverId: followingId,
			// propertyId: followingId,
		};
		await this.notificationService.createNotification(notificInput);

		await this.memberService.memberStatsEditor({ _id: followerId, targetKey: 'memberFollowings', modifier: 1 });
		await this.memberService.memberStatsEditor({ _id: followingId, targetKey: 'memberFollowers', modifier: 1 });

		return result;
	}

	private async registerSubscription(followerId: ObjectId, followingId: ObjectId): Promise<Follower> {
		try {
			return await this.followModel.create({
				followingId: followingId,
				followerId: followerId,
			});
		} catch (err) {
			console.log('Error: on registerSubscription Service model', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}

	public async unsubscribe(followerId: ObjectId, followingId: ObjectId): Promise<Follower> {
		const targetMember = await this.memberService.getMember(null, followingId);
		if (!targetMember) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		const result = await this.followModel
			.findOneAndDelete({
				followingId: followingId,
				followerId: followerId,
			})
			.exec();

		const authMember: Member = await this.memberModel
			.findOne({ _id: followerId, memberStatus: MemberStatus.ACTIVE })
			.exec();
		if (!authMember) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		const notificInput: NotificationInput = {
			notificationGroup: NotificationGroup.ARTICLE,
			notificationType: NotificationType.UNSUBSCRIBE,
			notificationStatus: NotificationStatus.WAIT,
			notificationTitle: `Follow`,
			notificationDesc: `${authMember.memberNick} unfollowed you `,
			authorId: followerId,
			receiverId: followingId,
			// propertyId: followingId,
		};
		await this.notificationService.createNotification(notificInput);

		if (!result) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		await this.memberService.memberStatsEditor({
			_id: followerId,
			targetKey: 'memberFollowings',
			modifier: -1,
		});
		await this.memberService.memberStatsEditor({
			_id: followingId,
			targetKey: 'memberFollowers',
			modifier: -1,
		});

		return result;
	}

	public async getMemberFollowings(memberId: ObjectId, input: FollowInquiry): Promise<Followings> {
		const { page, limit, search } = input;

		if (!search?.followerId) throw new InternalServerErrorException(Message.BAD_REQUEST);

		const match: T = { followerId: search?.followerId };
		console.log('match: ->', match);

		const result = await this.followModel
			.aggregate([
				{ $match: match },
				{ $sort: { createdAt: Direction.DESC } },
				{
					$facet: {
						list: [
							{ $skip: (page - 1) * limit },
							{ $limit: limit },
							//meLiked
							lookupAuthMemberLiked(memberId, '$followingId'),
							//meFollowed
							lookupAuthMemberFollowed({
								followerId: memberId,
								followingId: '$followingId',
							}),

							lookupFollowingData,
							{ $unwind: '$followingData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		if (!result) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		return result[0];
	}

	public async getMemberFollowers(memberId: ObjectId, input: FollowInquiry): Promise<Followers> {
		const { page, limit, search } = input;
		if (!search?.followingId) throw new InternalServerErrorException(Message.BAD_REQUEST);

		const match: T = { followingId: search?.followingId };
		console.log('match:', match);

		const result = await this.followModel
			.aggregate([
				{ $match: match },
				{ $sort: { createdAt: Direction.DESC } },
				{
					$facet: {
						list: [
							{ $skip: (page - 1) * limit },
							{ $limit: limit },
							//meLiked,
							lookupAuthMemberLiked(memberId, '$followerId'),
							//meFollowed
							lookupAuthMemberFollowed({
								followerId: memberId,
								followingId: '$followerId',
							}),
							lookupFollowerData,
							{ $unwind: '$followerData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();

		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		return result[0];
	}
}